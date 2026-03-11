package com.ecommerce.service;

import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class OrderService {

    @org.springframework.beans.factory.annotation.Autowired
    private OrderRepository orderRepo;
    @org.springframework.beans.factory.annotation.Autowired
    private ProductRepository productRepo;

    public record OrderItemRequest(Long productId, int quantity) {}

    public record OrderRequest(
            String customerName, String customerEmail, String customerPhone,
            String shippingAddress, String notes,
            List<OrderItemRequest> items) {}

    public Page<Order> getAllOrders(int page, int size) {
        return orderRepo.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
    }

    public Order getOrderById(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + id));
    }

    @Transactional
    public Order createOrder(OrderRequest req) {
        Order order = Order.builder()
                .customerName(req.customerName())
                .customerEmail(req.customerEmail())
                .customerPhone(req.customerPhone())
                .shippingAddress(req.shippingAddress())
                .notes(req.notes())
                .totalAmount(BigDecimal.ZERO)
                .build();

        List<OrderItem> items = req.items().stream().map(itemReq -> {
            Product product = productRepo.findById(itemReq.productId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found: " + itemReq.productId()));

            if (product.getStock() < itemReq.quantity()) {
                throw new IllegalStateException("Insufficient stock for: " + product.getName());
            }

            product.setStock(product.getStock() - itemReq.quantity());
            productRepo.save(product);

            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.quantity())
                    .unitPrice(product.getPrice())
                    .build();
        }).collect(Collectors.toList());

        order.setItems(items);

        BigDecimal total = items.stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        return orderRepo.save(order);
    }

    @Transactional
    public Order updateStatus(Long id, Order.Status status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepo.save(order);
    }

    @Transactional
    public void cancelOrder(Long id) {
        Order order = getOrderById(id);
        if (order.getStatus() == Order.Status.SHIPPED || order.getStatus() == Order.Status.DELIVERED) {
            throw new IllegalStateException("Cannot cancel order in status: " + order.getStatus());
        }

        // Restore stock
        order.getItems().forEach(item -> {
            Product p = item.getProduct();
            p.setStock(p.getStock() + item.getQuantity());
            productRepo.save(p);
        });

        order.setStatus(Order.Status.CANCELLED);
        orderRepo.save(order);
    }
}
