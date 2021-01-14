import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Products } from '../products/products.service';

import { HttpClient } from '@angular/common/http';

import { PromoEnum } from './promo.enum';

export class CartContent {
  product: Products;
  quantity: number;
  totalPrice: number;
}

class Promo {
  promoCode: string;
  promoDescription: string;
  promoType: PromoEnum;
  percentageDiscount: number;
  priceReduction: number;
  minUnit: number;
  maxUnit: number;
  requiredUnit: string[];
  minPrice: number;
  maxPrice: number;
  region: string;
  applicableProduct: string[];
  status: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private promoCodeUrl = '/assets/json/promo-list.json';

  private _cart: BehaviorSubject<CartContent[]> = new BehaviorSubject<CartContent[]>([]);
  public readonly cart: Observable<CartContent[]> = this._cart.asObservable();
  private _cartTotalCost: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly cartTotalCost: Observable<number> = this._cartTotalCost.asObservable();
  private activePromoCode: string;

  private originalProductPrice: Products[] = [];

  constructor(private http: HttpClient,) { }

  getCart(): Observable<CartContent[]> {
    return this.cart;
  }

  getCartTotalCost(): Observable<number> {
    return this.cartTotalCost;
  }

  addToCart(cartContent: CartContent) {
    let cart = this._cart.getValue();

    let foundItem = cart.find(cc => cc.product.productId == cartContent.product.productId);
    if (foundItem) {
      foundItem.quantity = foundItem.quantity + cartContent.quantity;
      foundItem.totalPrice = (foundItem.quantity * foundItem.product.price);
    }
    else {
      cartContent.product.originalPrice = cartContent.product.price;
      cartContent.totalPrice = (cartContent.quantity * cartContent.product.price);
      cart.push(cartContent);
    }

    this._cart.next(cart);
    this.updateCartTotalCost();
    if(this.activePromoCode) {
      this.applyCoupon(this.activePromoCode);
    }
  }

  updateCartTotalCost() {
    let cart = this._cart.getValue();
    let cartTotalCost = 0;
    cart.forEach(cc => {
      cartTotalCost += cc.totalPrice;
    })

    this._cartTotalCost.next(cartTotalCost);
  }

  applyCoupon(promoCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      //Remove any coupon first
      this.removeCoupon();

      //Apply back new coupon
      this.http.get<Promo[]>(this.promoCodeUrl).subscribe((promo: Promo[]) => {
        let foundPromo = promo.find(p => p.promoCode == promoCode);
        // console.log(this._cart.getValue(), promo, promoCode);
        if (foundPromo) {
          //Backup the original first
          this.couponLogic(foundPromo);
          this.updateCartTotalCost();
          this.activePromoCode = promoCode;
          resolve(true)
        }
        else {
          reject();
        }
      });
    })
  }

  removeCoupon() {
    // console.log("Removing", this.originalProductPrice.length);
    let cartContent = this._cart.getValue();

    cartContent.forEach((cart: CartContent) => {
      cart.product.price = cart.product.originalPrice;
      cart.totalPrice = (cart.product.price * cart.quantity);
    });

    // console.log(cartContent);
    this._cart.next(cartContent);
    this.updateCartTotalCost();
    this.activePromoCode = null;
  }

  //Coupon Logics
  couponLogic(promo: Promo) {
    let updatedCartWithPromo = this._cart.getValue();
    let cartTotalCost = this._cartTotalCost.getValue();

    let skipLogic = false;
    if(promo.requiredUnit) {
      promo.requiredUnit.forEach(unit => {
        let unitStr = unit.split("|")[0];
        let unitCount = Number.parseInt(unit.split("|")[1]);
        let foundProduct = updatedCartWithPromo.find((cc: CartContent) => cc.product.productId == unitStr);
        if(foundProduct.quantity < unitCount) {
          skipLogic = true;
        }
      });
    }

    if( !skipLogic && 
        !(promo.minPrice && cartTotalCost < promo.minPrice) && 
        !(promo.maxPrice && cartTotalCost > promo.maxPrice)) {
      switch (promo.promoType) {
        case PromoEnum.PERCENTAGE_CUT:
          console.log("Percentage Cut");
          //Check applicable product first
          updatedCartWithPromo.forEach((cartContent: CartContent) => {
            if (promo.applicableProduct) {
              if (promo.applicableProduct.includes(cartContent.product.productId)) {
                cartContent.product.price = this.percentageCut(cartContent.product.originalPrice, promo.percentageDiscount);
                cartContent.totalPrice = (cartContent.quantity * cartContent.product.price);
              }
            }
            else {
              if(!(promo.minUnit && cartContent.quantity < promo.minUnit) && !(promo.maxUnit && cartContent.quantity > promo.maxUnit)) {
                cartContent.product.price = this.percentageCut(cartContent.product.originalPrice, promo.percentageDiscount);
                cartContent.totalPrice = (cartContent.quantity * cartContent.product.price);
              }
            }
          });
          break;
        case PromoEnum.PRICE_REDUCTION:
          console.log("Price reduce");
          //Check applicable product first
          updatedCartWithPromo.forEach((cartContent: CartContent) => {
            if (promo.applicableProduct) {
              if (promo.applicableProduct.includes(cartContent.product.productId)) {
                cartContent.product.price = this.priceReduce(cartContent.product.originalPrice, promo.priceReduction);
                cartContent.totalPrice = (cartContent.quantity * cartContent.product.price);
              }
            }
            else {
              if(!(promo.minUnit && cartContent.quantity < promo.minUnit) && !(promo.maxUnit && cartContent.quantity > promo.maxUnit)) {
                cartContent.product.price = this.priceReduce(cartContent.product.originalPrice, promo.priceReduction);
                cartContent.totalPrice = (cartContent.quantity * cartContent.product.price);
              }
            }
          });
          break;
        default:
          console.log("No Promo");
          break;
      }
    }
    else {
    }

    this._cart.next(updatedCartWithPromo);
  }

  //Percentage Cut Logic
  percentageCut(price, percentageCut): number {
    let priceToCut = (price * percentageCut) / 100;
    return (price - priceToCut);
  }

  //Price Reduction Logic
  priceReduce(price, priceReduction): number {
    return priceReduction;
  }
}
