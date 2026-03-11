export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface Product {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  sku?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName?: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderCreateRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  notes?: string;
  items: { productId: number; quantity: number }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductSearchParams {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
