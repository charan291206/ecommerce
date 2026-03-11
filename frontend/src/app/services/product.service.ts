import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Page, Product, ProductSearchParams } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getProducts(params: ProductSearchParams = {}): Observable<Page<Product>> {
    let httpParams = new HttpParams();
    if (params.categoryId !== undefined) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params.minPrice   !== undefined) httpParams = httpParams.set('minPrice', params.minPrice);
    if (params.maxPrice   !== undefined) httpParams = httpParams.set('maxPrice', params.maxPrice);
    if (params.search)                   httpParams = httpParams.set('search', params.search);
    if (params.page       !== undefined) httpParams = httpParams.set('page', params.page);
    if (params.size       !== undefined) httpParams = httpParams.set('size', params.size);
    if (params.sortBy)                   httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDir)                  httpParams = httpParams.set('sortDir', params.sortDir);
    return this.http.get<Page<Product>>(`${this.baseUrl}/products`, { params: httpParams });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }
}
