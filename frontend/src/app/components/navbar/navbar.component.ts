// navbar.component.ts
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/" class="brand">
          <span class="brand-icon">◈</span>
          <span class="brand-name">LUXE<em>MART</em></span>
        </a>

        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Shop</a>
          <a routerLink="/cart" routerLinkActive="active" class="cart-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            @if (cartService.count() > 0) {
              <span class="badge">{{ cartService.count() }}</span>
            }
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(10, 8, 6, 0.96);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(212, 175, 55, 0.15);
    }
    .nav-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #d4af37;
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.6rem;
      font-weight: 600;
      letter-spacing: 0.1em;
    }
    .brand-icon { font-size: 1.2rem; opacity: 0.8; }
    .brand-name em { font-style: italic; color: #e8e0d0; }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    .nav-links a {
      color: #b0a898;
      text-decoration: none;
      font-family: 'Jost', sans-serif;
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    .nav-links a:hover, .nav-links a.active { color: #d4af37; }
    .cart-link {
      position: relative;
      display: flex;
      align-items: center;
    }
    .badge {
      position: absolute;
      top: -8px;
      right: -10px;
      background: #d4af37;
      color: #0a0806;
      font-size: 0.65rem;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class NavbarComponent {
  cartService = inject(CartService);
}
