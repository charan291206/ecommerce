package com.ecommerce.service;

import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class ProductService {

    @org.springframework.beans.factory.annotation.Autowired
    private ProductRepository productRepo;
    @org.springframework.beans.factory.annotation.Autowired
    private CategoryRepository categoryRepo;

    // ── Categories ──────────────────────────────────────────

    public List<Category> getAllCategories() {
        return categoryRepo.findAllByOrderByNameAsc();
    }

    public Category getCategoryById(Long id) {
        return categoryRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + id));
    }

    @Transactional
    public Category createCategory(Category category) {
        return categoryRepo.save(category);
    }

    // ── Products ─────────────────────────────────────────────

    public Page<Product> searchProducts(Long categoryId, BigDecimal minPrice,
                                        BigDecimal maxPrice, String search,
                                        int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepo.search(categoryId, minPrice, maxPrice, search, pageable);
    }

    public Product getProductById(Long id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));
    }

    public Product getProductBySlug(String slug) {
        return productRepo.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + slug));
    }

    @Transactional
    public Product createProduct(Product product) {
        return productRepo.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Map<String, Object> fields) {
        Product p = getProductById(id);

        fields.forEach((key, value) -> {
            switch (key) {
                case "name"        -> p.setName((String) value);
                case "description" -> p.setDescription((String) value);
                case "price"       -> p.setPrice(new BigDecimal(value.toString()));
                case "stock"       -> p.setStock((Integer) value);
                case "imageUrl"    -> p.setImageUrl((String) value);
                case "isActive"    -> p.setIsActive((Boolean) value);
                case "slug"        -> p.setSlug((String) value);
            }
        });

        return productRepo.save(p);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product p = getProductById(id);
        p.setIsActive(false);
        productRepo.save(p);
    }
}
