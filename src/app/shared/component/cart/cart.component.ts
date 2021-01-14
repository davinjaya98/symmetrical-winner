import { Component, OnInit } from '@angular/core';
import { CartService, CartContent } from '../../services/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cart: CartContent[] = [];
  totalPrice: number = 0;

  promoCode: string = '';

  constructor(private cartService: CartService,) {}

  ngOnInit(): void {
    this.getCart();
  }

  getCart() {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;

      this.totalPrice = 0;
      this.cartService.getCartTotalCost().subscribe(totalPrice => {
        this.totalPrice = totalPrice;
      });
    });
  }

  getTotal() {
    return this.totalPrice;
  }

  applyCoupon() {
    this.cartService.applyCoupon(this.promoCode).then(r => console.log(r)).catch(err => console.log(err));
  }

  removeCoupon() {
    this.promoCode = "";
    this.cartService.removeCoupon();
  }
}
