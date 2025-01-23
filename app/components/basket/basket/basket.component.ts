import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { combineLatest, map, Observable, shareReplay, startWith, tap, withLatestFrom } from 'rxjs';
import { MappedPostOrderArticle } from 'src/@types/order-arena-user-portal/forms/MappedOrder';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { BasketServiceModule } from 'src/app/services/basket/basket-service.module';
import { BasketService } from 'src/app/services/basket/basket.service';
import { CmTranslateService } from 'src/app/services/cm-translate/cm-translate.service';
import { OrderArticlesServiceModule } from 'src/app/services/order-articles/order-articles-service.module';
import { OrderArticlesService } from 'src/app/services/order-articles/order-articles.service';
import { EmptyPlaceholderComponent } from 'src/app/shared-components/empty-placeholder/empty-placeholder.component';
import { QuantityControlsComponent } from '../../../shared-components/quantity-controls/quantity-controls.component';
import { CheckoutButtonComponent } from '../../checkout/checkout-button/checkout-button.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatIconModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatButtonModule,

    // Prosit
    CmTranslateModule,
    BasketServiceModule,
    OrderArticlesServiceModule,

    EmptyPlaceholderComponent,
    QuantityControlsComponent,
    CheckoutButtonComponent,
  ],
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketComponent implements OnInit {
  @Input() isOrderForm = false;

  articles$: Observable<MappedPostOrderArticle[]>;
  netPrice$: Observable<number>;
  vatRate$: Observable<number>;
  vatPrice$: Observable<number>;
  grossPrice$: Observable<number>;
  storeIsPickup$: Observable<boolean>;
  isPickup$: Observable<boolean>;

  isPickup = new FormControl<boolean>(false, { validators: Validators.required, updateOn: 'change' });

  hidden$: Observable<boolean>;

  destroyRef = inject(DestroyRef);

  constructor(
    private basketService: BasketService,
    private orderArticlesService: OrderArticlesService,
    private cmTranslateService: CmTranslateService
  ) {
    this.hidden$ = this.cmTranslateService.loaded$.pipe(
      startWith(false),
      map((loaded) => !loaded)
    );
  }

  ngOnInit(): void {
    this.storeIsPickup$ = this.basketService.isPickup.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(false),
      tap((isPickup) => {
        if (isPickup !== this.isPickup.value) {
          this.isPickup.setValue(isPickup, { onlySelf: true, emitEvent: false });
        }
      })
    );
    this.storeIsPickup$.subscribe();

    this.articles$ = this.orderArticlesService.getMappedArticles().pipe(shareReplay(1));

    this.isPickup$ = this.isPickup.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((isPickup) => this.basketService.updateStoreIsPickup(isPickup))
    );
    this.isPickup$.subscribe();

    this.netPrice$ = this.articles$.pipe(
      map((articles) => this.basketService.calculateNetPrice(articles)),
      shareReplay(1)
    );
    this.vatRate$ = this.articles$.pipe(
      map((articles) => this.basketService.calculateVatRate(articles)),
      shareReplay(1)
    );
    this.vatPrice$ = this.vatRate$.pipe(
      withLatestFrom(this.netPrice$),
      map(([vatRate, netPrice]) => this.basketService.calculateVatPrice(netPrice, vatRate))
    );
    this.grossPrice$ = combineLatest([this.netPrice$, this.vatRate$]).pipe(
      startWith([0, 0]),
      map(([netPrice, vatRate]) => this.basketService.calculateGrossPrice(netPrice, vatRate))
    );
  }

  setDelivery() {
    this.isPickup.setValue(false);
  }

  removeArticle(article: MappedPostOrderArticle) {
    this.orderArticlesService.removeOrderArticle(article.articleId);
  }
}
