import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="checkout-page">
      <h1 class="checkout-title">Checkout</h1>

      @if (success()) {
        <div class="success-box">
          <div class="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Order <strong>#{{ orderId() }}</strong> has been received. We'll be in touch soon.</p>
          <a routerLink="/" class="btn-gold">Continue Shopping</a>
        </div>
      } @else {
        <div class="checkout-layout">
          <!-- Form -->
          <form [formGroup]="form" (ngSubmit)="placeOrder()" class="checkout-form">
            <section class="form-section">
              <h3 class="section-title">Contact Information</h3>
              <div class="field-row">
                <div class="field">
                  <label>Full Name *</label>
                  <input formControlName="customerName" placeholder="Jane Doe" />
                  @if (form.get('customerName')?.invalid && form.get('customerName')?.touched) {
                    <span class="error">Name is required</span>
                  }
                </div>
                <div class="field">
                  <label>Email *</label>
                  <input formControlName="customerEmail" type="email" placeholder="jane@example.com" />
                  @if (form.get('customerEmail')?.invalid && form.get('customerEmail')?.touched) {
                    <span class="error">Valid email required</span>
                  }
                </div>
              </div>
              <div class="field">
                <label>Phone</label>
                <input formControlName="customerPhone" placeholder="+1 (555) 000-0000" />
              </div>
            </section>

            <section class="form-section">
              <h3 class="section-title">Shipping Address</h3>
              <div class="field">
                <label>Street Address *</label>
                <input formControlName="shippingAddress" placeholder="123 Main Street, City, State 00000" />
                @if (form.get('shippingAddress')?.invalid && form.get('shippingAddress')?.touched) {
                  <span class="error">Address is required</span>
                }
              </div>
              <div class="field">
                <label>Order Notes</label>
                <textarea formControlName="notes" rows="3" placeholder="Any special instructions..."></textarea>
              </div>
            </section>

            @if (error()) {
              <div class="error-banner">{{ error() }}</div>
            }

            <button type="submit" class="btn-place" [disabled]="placing()">
              @if (placing()) {
                Placing Order...
              } @else {
                Place Order — {{ cartService.total() | currency }}
              }
            </button>
          </form>

          <!-- Order summary -->
          <div class="order-summary">
            <h3 class="section-title">Order Review</h3>
            @for (item of cartService.items(); track item.product.id) {
              <div class="summary-item">
                <img [src]="item.product.imageUrl || 'https://placehold.co/60x50/1a1612/d4af37?text=P'"
                     [alt]="item.product.name" />
                <div class="si-info">
                  <p class="si-name">{{ item.product.name }}</p>
                  <p class="si-qty">Qty: {{ item.quantity }}</p>
                </div>
                <p class="si-price">{{ item.product.price * item.quantity | currency }}</p>
              </div>
            }
            <div class="summary-divider"></div>
            <div class="summary-total">
              <span>Total</span>
              <span>{{ cartService.total() | currency }}</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');

    .checkout-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 3rem 2rem 5rem;
    }
    .checkout-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.5rem;
      color: #e8e0d0;
      font-weight: 400;
      margin: 0 0 2.5rem;
    }

    .success-box {
      text-align: center;
      padding: 5rem 2rem;
    }
    .success-icon {
      width: 70px; height: 70px;
      background: rgba(106,191,105,0.15);
      border: 2px solid #6abf69;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem; color: #6abf69;
      margin: 0 auto 1.5rem;
    }
    .success-box h2 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem;
      color: #e8e0d0;
      font-weight: 400;
      margin-bottom: 0.5rem;
    }
    .success-box p {
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

    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 3rem;
      align-items: start;
    }

    .form-section { margin-bottom: 2rem; }
    .section-title {
      font-family: 'Jost', sans-serif;
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #d4af37;
      margin-bottom: 1rem;
    }
    .field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }
    .field label {
      font-family: 'Jost', sans-serif;
      font-size: 0.75rem;
      color: #7a7060;
      letter-spacing: 0.05em;
    }
    .field input, .field textarea {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(212,175,55,0.15);
      color: #e8e0d0;
      padding: 0.7rem 1rem;
      border-radius: 4px;
      font-family: 'Jost', sans-serif;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .field input:focus, .field textarea:focus { border-color: rgba(212,175,55,0.4); }
    .field textarea { resize: vertical; }
    .field input::placeholder, .field textarea::placeholder { color: #3a3028; }
    .error {
      font-family: 'Jost', sans-serif;
      font-size: 0.72rem;
      color: #cf6679;
    }
    .error-banner {
      background: rgba(207,102,121,0.1);
      border: 1px solid rgba(207,102,121,0.3);
      color: #cf6679;
      padding: 0.75rem 1rem;
      border-radius: 4px;
      font-family: 'Jost', sans-serif;
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
    }
    .btn-place {
      width: 100%;
      background: #d4af37;
      color: #0a0806;
      border: none;
      padding: 1rem;
      font-family: 'Jost', sans-serif;
      font-size: 0.85rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 500;
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.2s;
    }
    .btn-place:hover:not(:disabled) { background: #e8c84a; }
    .btn-place:disabled { opacity: 0.5; cursor: not-allowed; }

    .order-summary {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(212,175,55,0.12);
      border-radius: 8px;
      padding: 1.75rem;
      position: sticky;
      top: 90px;
    }
    .summary-item {
      display: grid;
      grid-template-columns: 54px 1fr auto;
      gap: 0.75rem;
      align-items: center;
      margin-bottom: 1rem;
    }
    .summary-item img {
      width: 54px; height: 44px;
      object-fit: cover;
      border-radius: 3px;
    }
    .si-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.95rem;
      color: #e8e0d0;
      margin: 0;
    }
    .si-qty {
      font-family: 'Jost', sans-serif;
      font-size: 0.75rem;
      color: #4a4030;
      margin: 0;
    }
    .si-price {
      font-family: 'Jost', sans-serif;
      font-size: 0.85rem;
      color: #b0a898;
      margin: 0;
    }
    .summary-divider {
      border-top: 1px solid rgba(255,255,255,0.07);
      margin: 1rem 0;
    }
    .summary-total {
      display: flex;
      justify-content: space-between;
      font-family: 'Jost', sans-serif;
      font-size: 1rem;
      color: #e8e0d0;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .checkout-layout { grid-template-columns: 1fr; }
      .field-row { grid-template-columns: 1fr; }
    }
  `]
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cartService = inject(CartService);
  private orderService = inject(OrderService);

  form = this.fb.group({
    customerName:    ['', Validators.required],
    customerEmail:   ['', [Validators.required, Validators.email]],
    customerPhone:   [''],
    shippingAddress: ['', Validators.required],
    notes:           ['']
  });

  placing = signal(false);
  success = signal(false);
  error   = signal<string | null>(null);
  orderId = signal<number | null>(null);

  placeOrder() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.cartService.items().length === 0) {
      this.error.set('Your cart is empty.'); return;
    }

    this.placing.set(true);
    this.error.set(null);

    const v = this.form.value;
    const payload = {
      customerName:    v.customerName!,
      customerEmail:   v.customerEmail!,
      customerPhone:   v.customerPhone || undefined,
      shippingAddress: v.shippingAddress!,
      notes:           v.notes || undefined,
      items: this.cartService.items().map(i => ({
        productId: i.product.id,
        quantity:  i.quantity
      }))
    };

    this.orderService.createOrder(payload).subscribe({
      next: order => {
        this.orderId.set(order.id);
        this.cartService.clearCart();
        this.success.set(true);
        this.placing.set(false);
      },
      error: err => {
        this.error.set(err.error?.error || 'Failed to place order. Please try again.');
        this.placing.set(false);
      }
    });
  }
}
