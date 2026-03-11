import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/index';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    @if (loading()) {
      <div class="loading-wrapper">
        <div class="spinner"></div>
      </div>
    } @else if (product()) {
      <div class="detail-page">
        <div class="breadcrumb">
          <a routerLink="/">Shop</a>
          <span>›</span>
          <span>{{ product()!.categoryName }}</span>
          <span>›</span>
          <span>{{ product()!.name }}</span>
        </div>

        <div class="detail-layout">
          <div class="img-section">
            <img [src]="product()!.imageUrl || 'https://placehold.co/600x500/1a1612/d4af37?text=Product'"
                 [alt]="product()!.name" />
          </div>

          <div class="info-section">
            <p class="detail-cat">{{ product()!.categoryName }}</p>
            <h1 class="detail-name">{{ product()!.name }}</h1>
            <p class="detail-sku">SKU: {{ product()!.sku || 'N/A' }}</p>
            <p class="detail-price">{{ product()!.price | currency }}</p>

            <div class="stock-badge" [class.out]="product()!.stock === 0">
              @if (product()!.stock > 0) {
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                In Stock ({{ product()!.stock }} available)
              } @else {
                Out of Stock
              }
            </div>

            <p class="detail-desc">{{ product()!.description }}</p>

            <div class="qty-row">
              <div class="qty-control">
                <button (click)="qty > 1 ? qty = qty - 1 : null">−</button>
                <span>{{ qty }}</span>
                <button (click)="qty < product()!.stock ? qty = qty + 1 : null">+</button>
              </div>
              <button class="btn-primary"
                      [disabled]="product()!.stock === 0"
                      (click)="addToCart()">
                Add to Cart
              </button>
            </div>

            @if (addedToCart()) {
              <div class="cart-confirm">
                ✓ Added to cart! <a routerLink="/cart">View Cart</a>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');

    .loading-wrapper {
      display: flex; justify-content: center; align-items: center;
      height: 50vh;
    }
    .spinner {
      width: 40px; height: 40px;
      border: 2px solid rgba(212,175,55,0.2);
      border-top-color: #d4af37;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .detail-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 2rem 4rem;
    }
    .breadcrumb {
      display: flex; align-items: center; gap: 0.5rem;
      font-family: 'Jost', sans-serif;
      font-size: 0.8rem;
      color: #4a4030;
      margin-bottom: 2.5rem;
    }
    .breadcrumb a { color: #d4af37; text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }

    .detail-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }
    .img-section img {
      width: 100%;
      aspect-ratio: 5/4;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid rgba(212,175,55,0.12);
    }

    .detail-cat {
      font-family: 'Jost', sans-serif;
      font-size: 0.7rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #d4af37;
      margin: 0 0 0.75rem;
    }
    .detail-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 3vw, 2.8rem);
      color: #e8e0d0;
      font-weight: 400;
      margin: 0 0 0.5rem;
      line-height: 1.1;
    }
    .detail-sku {
      font-family: 'Jost', sans-serif;
      font-size: 0.75rem;
      color: #4a4030;
      margin: 0 0 1.5rem;
    }
    .detail-price {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem;
      color: #d4af37;
      margin: 0 0 1rem;
      font-weight: 600;
    }
    .stock-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'Jost', sans-serif;
      font-size: 0.78rem;
      color: #6abf69;
      background: rgba(106,191,105,0.1);
      border: 1px solid rgba(106,191,105,0.25);
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 1.5rem;
    }
    .stock-badge.out {
      color: #cf6679;
      background: rgba(207,102,121,0.1);
      border-color: rgba(207,102,121,0.25);
    }
    .detail-desc {
      font-family: 'Jost', sans-serif;
      font-size: 0.95rem;
      color: #7a7060;
      line-height: 1.7;
      margin-bottom: 2rem;
      font-weight: 300;
    }
    .qty-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .qty-control {
      display: flex;
      align-items: center;
      gap: 0;
      border: 1px solid rgba(212,175,55,0.3);
      border-radius: 4px;
      overflow: hidden;
    }
    .qty-control button {
      background: rgba(255,255,255,0.04);
      border: none;
      color: #b0a898;
      width: 38px;
      height: 44px;
      cursor: pointer;
      font-size: 1.2rem;
      transition: background 0.2s;
    }
    .qty-control button:hover { background: rgba(212,175,55,0.15); color: #d4af37; }
    .qty-control span {
      font-family: 'Jost', sans-serif;
      font-size: 0.95rem;
      color: #e8e0d0;
      min-width: 40px;
      text-align: center;
    }
    .btn-primary {
      background: #d4af37;
      color: #0a0806;
      border: none;
      padding: 0 2rem;
      height: 44px;
      font-family: 'Jost', sans-serif;
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 500;
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.2s;
    }
    .btn-primary:hover:not(:disabled) { background: #e8c84a; }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
    .cart-confirm {
      margin-top: 1rem;
      font-family: 'Jost', sans-serif;
      font-size: 0.88rem;
      color: #6abf69;
    }
    .cart-confirm a { color: #d4af37; }

    @media (max-width: 768px) {
      .detail-layout { grid-template-columns: 1fr; gap: 2rem; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product    = signal<Product | null>(null);
  loading    = signal(true);
  addedToCart = signal(false);
  qty = 1;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe({
      next: p => { this.product.set(p); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  addToCart() {
    const p = this.product();
    if (!p) return;
    this.cartService.addToCart(p, this.qty);
    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 3000);
  }
}
