package com.ecommerce.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, unique = true, length = 270)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(unique = true, length = 80)
    private String sku;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public Product() {}

    // Getters
    public Long getId()                  { return id; }
    public Category getCategory()        { return category; }
    public String getName()              { return name; }
    public String getSlug()              { return slug; }
    public String getDescription()       { return description; }
    public BigDecimal getPrice()         { return price; }
    public Integer getStock()            { return stock; }
    public String getImageUrl()          { return imageUrl; }
    public String getSku()               { return sku; }
    public Boolean getIsActive()         { return isActive; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }

    // Convenience getters for JSON (avoids lazy-load issues)
    public Long getCategoryId()   { return category != null ? category.getId()   : null; }
    public String getCategoryName(){ return category != null ? category.getName() : null; }

    // Setters
    public void setId(Long id)                        { this.id = id; }
    public void setCategory(Category category)        { this.category = category; }
    public void setName(String name)                  { this.name = name; }
    public void setSlug(String slug)                  { this.slug = slug; }
    public void setDescription(String description)    { this.description = description; }
    public void setPrice(BigDecimal price)            { this.price = price; }
    public void setStock(Integer stock)               { this.stock = stock; }
    public void setImageUrl(String imageUrl)          { this.imageUrl = imageUrl; }
    public void setSku(String sku)                    { this.sku = sku; }
    public void setIsActive(Boolean isActive)         { this.isActive = isActive; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
