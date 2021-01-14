import { Component, OnInit } from '@angular/core';

import { ProductsService, Products } from '../../services/products/products.service';

import { CartService, CartContent } from '../../services/cart/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Products[];
  displayedColumns: string[] = ['productName', 'cost', 'action'];

  constructor(private productsService: ProductsService, private cartService: CartService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productsService.getProducts().subscribe(products => {
      this.products = products
    });
  }

  addToCart(product: Products) {
    let newContent: CartContent = new CartContent;
    //To Deep copy the javascript object
    newContent.product = JSON.parse(JSON.stringify(product));
    newContent.quantity = 1;
    this.cartService.addToCart(newContent);
  }
}
