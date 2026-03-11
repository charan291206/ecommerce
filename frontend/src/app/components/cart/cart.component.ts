import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page">
      <div class="cart-header">
        <h1>Your <em>Cart</em></h1>
        <p>{{ cartService.count() }} item{{ cartService.count() !== 1 ? 's' : '' }}</p>
      </div>

      @if (cartService.items().length === 0) {
        <div class="empty-cart">
          <div class="empty-icon">◈</div>
          <h2>Your cart is empty</h2>
          <p>Discover our curated collection and add something exceptional.</p>
          <a routerLink="/" class="btn-gold">Continue Shopping</a>
        </div>
      } @else {
        <div class="cart-layout">
          <div class="cart-items">
            @for (item of cartService.items(); track item.product.id) {
              <div class="cart-row">
                <img [src]="item.product.imageUrl || 'https://placehold.co/100x80/1a1612/d4af37?text=P'"
                     [alt]="item.product.name" />
                <div class="row-info">
                  <p class="row-cat">{{ item.product.categoryName }}</p>
                  <h3 class="row-name">{{ item.product.name }}</h3>
                  <p class="row-price">{{ item.product.price | currency }} each</p>
                </div>
                <div class="row-qty">
                  <button (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)">+</button>
                </div>
                <div class="row-subtotal">{{ item.product.price * item.quantity | currency }}</div>
                <button class="row-remove" (click)="cartService.removeItem(item.product.id)"
                        title="Remove">✕</button>
              </div>
            }
          </div>

          <div class="cart-summary">
            <h3 class="summary-title">Order Summary</h3>
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ cartService.total() | currency }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span class="free">Free</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ cartService.total() | currency }}</span>
            </div>
            <a routerLink="/checkout" class="btn-checkout">Proceed to Checkout</a>
            <a routerLink="/" class="btn-continue">← Continue Shopping</a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');

    .cart-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 2rem 5rem;
    }
    .cart-header {
      margin-bottom: 2.5rem;
      border-bottom: 1px solid rgba(212,175,55,0.15);
      padding-bottom: 1.5rem;
    }
    .cart-header h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.5rem;
      color: #e8e0d0;
      font-weight: 400;
      margin: 0;
    }
    .cart-header h1 em { color: #d4af37; font-style: italic; }
    .cart-header p {
      font-family: 'Jost', sans-serif;
      color: #4a4030;
      font-size: 0.85rem;
      margin: 0.3rem 0 0;
    }

    .empty-cart {
      text-align: center;
      padding: 5rem 2rem;
    }
    .empty-icon { font-size: 3rem; color: #4a4030; margin-bottom: 1.5rem; }
    .empty-cart h2 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem;
      color: #e8e0d0;
      font-weight: 400;
      margin-bottom: 0.5rem;
    }
    .empty-cart p {
      font-family: 'Jost', sans-serif;
      color: #7a7060;
      margin-bottom: 2rem;
    }
    .btn-gold {
      display: inline-block;
      background: #d4af37;
      color: #0a0806;
      text-decoration: none;
      padding: 0.8rem 2.5rem;
      font-family: 'Jost', sans-serif;
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 500;
      border-radius: 4px;
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 3rem;
      align-items: start;
    }

    .cart-row {
      display: grid;
      grid-template-columns: 80px 1fr auto auto auto;
      gap: 1rem;
      align-items: center;
      padding: 1.25rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .cart-row img {
      width: 80px;
      height: 64px;
      object-fit: cover;
      border-radius: 4px;
    }
    .row-cat {
      font-family: 'Jost', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #d4af37;
      margin: 0 0 0.2rem;
    }
    .row-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem;
      color: #e8e0d0;
      font-weight: 400;
      margin: 0 0 0.2rem;
    }
    .row-price {
      font-family: 'Jost', sans-serif;
      font-size: 0.8rem;
      color: #4a4030;
      margin: 0;
    }
    .row-qty {
      display: flex;
      align-items: center;
      gap: 0;
      border: 1px solid rgba(212,175,55,0.2);
      border-radius: 4px;
      overflow: hidden;
    }
    .row-qty button {
      background: rgba(255,255,255,0.03);
      border: none;
      color: #b0a898;
      width: 30px;
      height: 34px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s;
    }
    .row-qty button:hover { background: rgba(212,175,55,0.15); }
    .row-qty span {
      font-family: 'Jost', sans-serif;
      font-size: 0.85rem;
      color: #e8e0d0;
      min-width: 32px;
      text-align: center;
    }
    .row-subtotal {
      font-family: 'Jost', sans-serif;
      font-size: 0.95rem;
      color: #d4af37;
      font-weight: 500;
      min-width: 70px;
      text-align: right;
    }
    .row-remove {
      background: none;
      border: none;
      color: #3a3028;
      cursor: pointer;
      font-size: 0.7rem;
      padding: 4px;
      transition: color 0.2s;
    }
    .row-remove:hover { color: #cf6679; }

    .cart-summary {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(212,175,55,0.12);
      border-radius: 8px;
      padding: 1.75rem;
      position: sticky;
      top: 90px;
    }
    .summary-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.4rem;
      color: #e8e0d0;
      font-weight: 400;
      margin: 0 0 1.5rem;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-family: 'Jost', sans-serif;
      font-size: 0.88rem;
      color: #7a7060;
      margin-bottom: 0.75rem;
    }
    .summary-row.total {
      font-size: 1rem;
      color: #e8e0d0;
      font-weight: 500;
      margin-bottom: 0;
    }
    .free { color: #6abf69; }
    .summary-divider {
      border-top: 1px solid rgba(255,255,255,0.07);
      margin: 1rem 0;
    }
    .btn-checkout {
      display: block;
      text-align: center;
      background: #d4af37;
      color: #0a0806;
      text-decoration: none;
      padding: 0.85rem;
      font-family: 'Jost', sans-serif;
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 500;
      border-radius: 4px;
      margin-top: 1.5rem;
      transition: background 0.2s;
    }
    .btn-checkout:hover { background: #e8c84a; }
    .btn-continue {
      display: block;
      text-align: center;
      color: #4a4030;
      text-decoration: none;
      padding: 0.75rem;
      font-family: 'Jost', sans-serif;
      font-size: 0.78rem;
      margin-top: 0.75rem;
      transition: color 0.2s;
    }
    .btn-continue:hover { color: #d4af37; }

    @media (max-width: 768px) {
      .cart-layout { grid-template-columns: 1fr; }
      .cart-row { grid-template-columns: 60px 1fr; grid-template-rows: auto auto auto; }
    }
  `]
})
export class CartComponent {
  cartService = inject(CartService);
}
