import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class Products {
  productId: string;
  productName: string;
  price: number;
  currency: string;
  region: string;
  status: boolean;
  originalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private heroesUrl = '/assets/json/product-list.json';

  constructor(private http: HttpClient,) { }

  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(this.heroesUrl);
  }
}
