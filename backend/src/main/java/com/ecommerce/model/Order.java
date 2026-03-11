package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    public enum Status {
        PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false, length = 200)
    private String customerName;

    @Column(name = "customer_email", nullable = false, length = 200)
    private String customerEmail;

    @Column(name = "customer_phone", length = 30)
    private String customerPhone;

    @Column(name = "shipping_address", nullable = false, columnDefinition = "TEXT")
    private String shippingAddress;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<OrderItem> items = new ArrayList<>();

    // Constructors
    public Order() {}

    // Getters
    public Long getId()                  { return id; }
    public String getCustomerName()      { return customerName; }
    public String getCustomerEmail()     { return customerEmail; }
    public String getCustomerPhone()     { return customerPhone; }
    public String getShippingAddress()   { return shippingAddress; }
    public BigDecimal getTotalAmount()   { return totalAmount; }
    public Status getStatus()            { return status; }
    public String getNotes()             { return notes; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }
    public List<OrderItem> getItems()    { return items; }

    // Setters
    public void setId(Long id)                              { this.id = id; }
    public void setCustomerName(String customerName)        { this.customerName = customerName; }
    public void setCustomerEmail(String customerEmail)      { this.customerEmail = customerEmail; }
    public void setCustomerPhone(String customerPhone)      { this.customerPhone = customerPhone; }
    public void setShippingAddress(String shippingAddress)  { this.shippingAddress = shippingAddress; }
    public void setTotalAmount(BigDecimal totalAmount)      { this.totalAmount = totalAmount; }
    public void setStatus(Status status)                    { this.status = status; }
    public void setNotes(String notes)                      { this.notes = notes; }
    public void setCreatedAt(LocalDateTime createdAt)       { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)       { this.updatedAt = updatedAt; }
    public void setItems(List<OrderItem> items)             { this.items = items; }

    // Builder pattern (used in OrderService)
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Order order = new Order();

        public Builder customerName(String v)      { order.customerName = v;      return this; }
        public Builder customerEmail(String v)     { order.customerEmail = v;     return this; }
        public Builder customerPhone(String v)     { order.customerPhone = v;     return this; }
        public Builder shippingAddress(String v)   { order.shippingAddress = v;   return this; }
        public Builder notes(String v)             { order.notes = v;             return this; }
        public Builder totalAmount(BigDecimal v)   { order.totalAmount = v;       return this; }
        public Builder status(Status v)            { order.status = v;            return this; }
        public Order build()                       { return order; }
    }

    @PreUpdate
    void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
