import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, map, Observable, startWith, tap } from 'rxjs';
import { MappedPostOrderArticle } from 'src/@types/order-arena-user-portal/forms/MappedOrder';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import { updateIsPickupAction } from 'src/app/@core/store/actions/is-pickup';
import { OrderArticlesService } from '../order-articles/order-articles.service';
import { OrderMapperService } from '../order/order-mapper/order-mapper.service';

@Injectable()
export class BasketService {
  maxGuests$ = new BehaviorSubject<number>(1);

  get isPickup(): Observable<boolean> {
    return this.ngrx.pipe(select((store) => store.isPickup));
  }

  constructor(
    private ngrx: Store<UPState>,
    private orderArticlesService: OrderArticlesService,
    private orderMapperService: OrderMapperService
  ) {
    this.calculateMaxGuests()
      .pipe(
        startWith(1),
        tap((maxGuests) => this.maxGuests$.next(maxGuests)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  isEmpty(): Observable<boolean> {
    return this.orderArticlesService.orderArticles.pipe(map((articles) => articles && !articles.length));
  }

  isEquipmentInBasket(): Observable<boolean> {
    return this.orderArticlesService.orderArticles.pipe(
      map((articles) => !!this.orderMapperService.filterPostOrderArticlesByType(articles, 'equipment').length)
    );
  }

  calculateMinGuests(): Observable<number> {
    return this.orderArticlesService.getMappedArticles().pipe(
      map((articles) => {
        const minGuests = Math.max(...articles.map((article) => article.minPersons));
        return minGuests > 0 ? minGuests : 1;
      })
    );
  }

  calculateMaxGuests(): Observable<number> {
    return this.orderArticlesService.getMappedArticles().pipe(
      map((articles) => {
        const maxGuests = Math.max(...articles.map((article) => article.quantity));
        return maxGuests > 0 ? maxGuests : 1;
      })
    );
  }

  calculateNetPrice(articles: MappedPostOrderArticle[]): number {
    return articles.reduce((totalPrice, article) => totalPrice + article.quantity * article.price, 0);
  }

  calculateVatRate(articles: MappedPostOrderArticle[]): number {
    return articles.reduce(
      (vatRate, article) => (article.vatRate ? Math.max(vatRate, article.vatRate.value) : vatRate),
      0
    );
  }

  calculateVatPrice(netPrice: number, vatRate: number): number {
    return netPrice * vatRate;
  }

  calculateGrossPrice(netPrice: number, vatRate: number): number {
    return netPrice * (1 + vatRate);
  }

  calculateTotalPrice(): Observable<number> {
    return this.orderArticlesService.getMappedArticles().pipe(
      map((articles) => {
        const netPrice = this.calculateNetPrice(articles);
        const vatRate = this.calculateVatRate(articles);

        return this.calculateGrossPrice(netPrice, vatRate);
      })
    );
  }

  updateStoreIsPickup(isPickup: boolean) {
    this.ngrx.dispatch(updateIsPickupAction(isPickup));
  }
}
