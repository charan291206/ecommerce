package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    // Constructors
    public OrderItem() {}

    // Getters
    public Long getId()            { return id; }
    public Order getOrder()        { return order; }
    public Product getProduct()    { return product; }
    public Integer getQuantity()   { return quantity; }
    public BigDecimal getUnitPrice(){ return unitPrice; }

    // Computed subtotal for JSON response
    public BigDecimal getSubtotal() {
        if (unitPrice != null && quantity != null) {
            return unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
        return BigDecimal.ZERO;
    }

    // Setters
    public void setId(Long id)               { this.id = id; }
    public void setOrder(Order order)        { this.order = order; }
    public void setProduct(Product product)  { this.product = product; }
    public void setQuantity(Integer quantity){ this.quantity = quantity; }
    public void setUnitPrice(BigDecimal unitPrice){ this.unitPrice = unitPrice; }

    // Builder pattern (used in OrderService)
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final OrderItem item = new OrderItem();

        public Builder order(Order v)          { item.order = v;     return this; }
        public Builder product(Product v)      { item.product = v;   return this; }
        public Builder quantity(Integer v)     { item.quantity = v;  return this; }
        public Builder unitPrice(BigDecimal v) { item.unitPrice = v; return this; }
        public OrderItem build()               { return item; }
    }
}
