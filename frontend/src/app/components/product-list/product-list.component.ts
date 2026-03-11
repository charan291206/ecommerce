import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Category, Product, ProductSearchParams } from '../../models/index';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="shop-page">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-text">
          <p class="hero-sub">Curated Collection</p>
          <h1>Discover <em>Exceptional</em> Products</h1>
          <p class="hero-desc">Handpicked for quality, designed for life.</p>
        </div>
      </section>

      <div class="shop-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
          <h3 class="sidebar-title">Categories</h3>
          <ul class="cat-list">
            <li (click)="setCategoryFilter(null)" [class.active]="!selectedCategoryId()">
              All Products
            </li>
            @for (cat of categories(); track cat.id) {
              <li (click)="setCategoryFilter(cat.id)" [class.active]="selectedCategoryId() === cat.id">
                {{ cat.name }}
              </li>
            }
          </ul>

          <h3 class="sidebar-title" style="margin-top:2rem">Price Range</h3>
          <div class="price-inputs">
            <input type="number" placeholder="Min $" [(ngModel)]="minPrice" (change)="applyFilters()" />
            <span>—</span>
            <input type="number" placeholder="Max $" [(ngModel)]="maxPrice" (change)="applyFilters()" />
          </div>

          <h3 class="sidebar-title" style="margin-top:2rem">Sort By</h3>
          <select [(ngModel)]="sortBy" (change)="applyFilters()" class="sort-select">
            <option value="createdAt|desc">Newest First</option>
            <option value="price|asc">Price: Low to High</option>
            <option value="price|desc">Price: High to Low</option>
            <option value="name|asc">Name A–Z</option>
          </select>
        </aside>

        <!-- Main content -->
        <main class="products-main">
          <!-- Search bar -->
          <div class="search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search products..." [(ngModel)]="searchQuery"
                   (input)="onSearchInput()" />
          </div>

          @if (loading()) {
            <div class="loading-grid">
              @for (n of [1,2,3,4,5,6,7,8]; track n) {
                <div class="skeleton-card"></div>
              }
            </div>
          } @else if (products().length === 0) {
            <div class="empty-state">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          } @else {
            <div class="product-grid">
              @for (product of products(); track product.id) {
                <div class="product-card" [routerLink]="['/product', product.id]">
                  <div class="card-img-wrap">
                    <img [src]="product.imageUrl || 'https://placehold.co/400x300/1a1612/d4af37?text=Product'"
                         [alt]="product.name" loading="lazy" />
                    <div class="card-overlay">
                      <button class="btn-add" (click)="addToCart($event, product)">
                        Add to Cart
                      </button>
                    </div>
                    @if (product.stock === 0) {
                      <span class="out-of-stock">Out of Stock</span>
                    }
                  </div>
                  <div class="card-body">
                    <p class="card-cat">{{ product.categoryName }}</p>
                    <h3 class="card-name">{{ product.name }}</h3>
                    <p class="card-price">{{ product.price | currency }}</p>
                  </div>
                </div>
              }
            </div>

            <!-- Pagination -->
            @if (totalPages() > 1) {
              <div class="pagination">
                <button [disabled]="currentPage() === 0" (click)="goToPage(currentPage() - 1)">‹</button>
                @for (p of pageNumbers(); track p) {
                  <button [class.active]="p === currentPage()" (click)="goToPage(p)">{{ p + 1 }}</button>
                }
                <button [disabled]="currentPage() === totalPages() - 1" (click)="goToPage(currentPage() + 1)">›</button>
              </div>
            }
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

    :host { display: block; }

    .hero {
      background: linear-gradient(135deg, #0d0a08 0%, #1a1310 50%, #0d0a08 100%);
      padding: 5rem 2rem;
      text-align: center;
      border-bottom: 1px solid rgba(212,175,55,0.12);
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%);
    }
    .hero-text { position: relative; }
    .hero-sub {
      font-family: 'Jost', sans-serif;
      font-size: 0.75rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #d4af37;
      margin-bottom: 1rem;
    }
    .hero h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.5rem, 5vw, 4rem);
      color: #e8e0d0;
      font-weight: 400;
      margin: 0 0 1rem;
      line-height: 1.1;
    }
    .hero h1 em { color: #d4af37; font-style: italic; }
    .hero-desc {
      font-family: 'Jost', sans-serif;
      color: #7a7060;
      font-weight: 300;
      font-size: 1.05rem;
    }

    .shop-layout {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem;
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 3rem;
    }

    .sidebar { min-width: 0; }
    .sidebar-title {
      font-family: 'Jost', sans-serif;
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #d4af37;
      margin-bottom: 1rem;
    }
    .cat-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .cat-list li {
      font-family: 'Jost', sans-serif;
      font-size: 0.9rem;
      color: #7a7060;
      padding: 0.5rem 0;
      cursor: pointer;
      transition: color 0.2s;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .cat-list li:hover, .cat-list li.active { color: #d4af37; }
    .price-inputs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .price-inputs input, .sort-select {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(212,175,55,0.2);
      color: #e8e0d0;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      font-family: 'Jost', sans-serif;
      font-size: 0.85rem;
      width: 100%;
      outline: none;
    }
    .price-inputs input { width: 80px; }
    .price-inputs span { color: #4a4030; }
    .sort-select { margin-top: 0.5rem; cursor: pointer; }
    .sort-select option { background: #1a1310; }

    .products-main { min-width: 0; }
    .search-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(212,175,55,0.15);
      border-radius: 6px;
      padding: 0.75rem 1rem;
      margin-bottom: 2rem;
      color: #7a7060;
    }
    .search-bar input {
      background: none;
      border: none;
      outline: none;
      color: #e8e0d0;
      font-family: 'Jost', sans-serif;
      font-size: 0.95rem;
      flex: 1;
    }
    .search-bar input::placeholder { color: #4a4030; }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s ease, border-color 0.3s;
    }
    .product-card:hover {
      transform: translateY(-4px);
      border-color: rgba(212,175,55,0.3);
    }
    .card-img-wrap {
      position: relative;
      aspect-ratio: 4/3;
      overflow: hidden;
      background: #111;
    }
    .card-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .product-card:hover .card-img-wrap img { transform: scale(1.06); }
    .card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(10,8,6,0.6);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 1.25rem;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .product-card:hover .card-overlay { opacity: 1; }
    .btn-add {
      background: #d4af37;
      color: #0a0806;
      border: none;
      padding: 0.6rem 1.4rem;
      font-family: 'Jost', sans-serif;
      font-size: 0.78rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-weight: 500;
      cursor: pointer;
      border-radius: 3px;
      transition: background 0.2s;
    }
    .btn-add:hover { background: #e8c84a; }
    .out-of-stock {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(180,40,40,0.85);
      color: #fff;
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 3px;
      font-family: 'Jost', sans-serif;
    }
    .card-body { padding: 1rem 1.1rem 1.2rem; }
    .card-cat {
      font-family: 'Jost', sans-serif;
      font-size: 0.68rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #d4af37;
      margin: 0 0 0.3rem;
    }
    .card-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem;
      color: #e8e0d0;
      margin: 0 0 0.4rem;
      font-weight: 400;
      line-height: 1.3;
    }
    .card-price {
      font-family: 'Jost', sans-serif;
      font-size: 1rem;
      color: #b0a898;
      margin: 0;
      font-weight: 300;
    }

    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .skeleton-card {
      height: 320px;
      background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%);
      background-size: 400% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
      border-radius: 8px;
    }
    @keyframes shimmer {
      0% { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }

    .empty-state {
      text-align: center;
      padding: 4rem;
      color: #4a4030;
      font-family: 'Jost', sans-serif;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 3rem;
    }
    .pagination button {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(212,175,55,0.15);
      color: #b0a898;
      width: 36px;
      height: 36px;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Jost', sans-serif;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .pagination button:hover:not(:disabled) { border-color: #d4af37; color: #d4af37; }
    .pagination button.active { background: #d4af37; color: #0a0806; border-color: #d4af37; font-weight: 600; }
    .pagination button:disabled { opacity: 0.3; cursor: not-allowed; }

    @media (max-width: 768px) {
      .shop-layout { grid-template-columns: 1fr; }
      .sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  categories    = signal<Category[]>([]);
  products      = signal<Product[]>([]);
  loading       = signal(true);
  currentPage   = signal(0);
  totalPages    = signal(0);
  pageNumbers   = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i));

  selectedCategoryId = signal<number | null>(null);
  searchQuery = '';
  minPrice?: number;
  maxPrice?: number;
  sortBy = 'createdAt|desc';
  private searchTimer?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.productService.getCategories().subscribe(cats => this.categories.set(cats));
    this.loadProducts();
  }

  setCategoryFilter(id: number | null) {
    this.selectedCategoryId.set(id);
    this.currentPage.set(0);
    this.loadProducts();
  }

  applyFilters() {
    this.currentPage.set(0);
    this.loadProducts();
  }

  onSearchInput() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.applyFilters(), 400);
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadProducts() {
    this.loading.set(true);
    const [sortByField, sortDir] = this.sortBy.split('|');
    const params: ProductSearchParams = {
      categoryId: this.selectedCategoryId() ?? undefined,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      search: this.searchQuery || undefined,
      page: this.currentPage(),
      size: 12,
      sortBy: sortByField,
      sortDir: sortDir as 'asc' | 'desc'
    };
    this.productService.getProducts(params).subscribe({
      next: page => {
        this.products.set(page.content);
        this.totalPages.set(page.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addToCart(event: Event, product: Product) {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(product);
  }
}
