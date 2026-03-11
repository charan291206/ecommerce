package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 110)
    private String slug;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products;

    // Constructors
    public Category() {}

    // Getters
    public Long getId()                 { return id; }
    public String getName()             { return name; }
    public String getSlug()             { return slug; }
    public String getImageUrl()         { return imageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<Product> getProducts()  { return products; }

    // Setters
    public void setId(Long id)                        { this.id = id; }
    public void setName(String name)                  { this.name = name; }
    public void setSlug(String slug)                  { this.slug = slug; }
    public void setImageUrl(String imageUrl)          { this.imageUrl = imageUrl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setProducts(List<Product> products)   { this.products = products; }
}
