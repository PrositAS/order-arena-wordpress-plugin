import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MomentModule } from 'ngx-moment';
import {
  concatMap,
  filter,
  from,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  startWith,
  tap,
  toArray,
} from 'rxjs';
import { Article } from 'src/@types/order-arena-user-portal/Article';
import { Order as PastOrder } from 'src/@types/order-arena-user-portal/Order';
import { Order, OrderData } from 'src/@types/order-arena-user-portal/order-form/Order';
import { OrderArticle } from 'src/@types/order-arena-user-portal/OrderArticle';
import { OrderRequest } from 'src/@types/order-arena-user-portal/OrderRequest';
import { PostOrderArticle } from 'src/@types/order-arena-user-portal/params/PostOrder';
import { User } from 'src/@types/order-arena-user-portal/User';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { OrderDataModule } from 'src/app/pipes/order/order-data/order-data.module';
import { ArticlesService } from 'src/app/services/articles/articles.service';
import { CmTranslateServiceModule } from 'src/app/services/cm-translate/cm-translate-service.module';
import { CmTranslateService } from 'src/app/services/cm-translate/cm-translate.service';
import { OrderArticlesServiceModule } from 'src/app/services/order-articles/order-articles-service.module';
import { OrderArticlesService } from 'src/app/services/order-articles/order-articles.service';
import { OrderMapperServiceModule } from 'src/app/services/order/order-mapper/order-mapper-service.module';
import { OrderMapperService } from 'src/app/services/order/order-mapper/order-mapper.service';
import { OrderServiceModule } from 'src/app/services/order/order/order-service.module';
import { OrderService } from 'src/app/services/order/order/order.service';
import { EmptyPlaceholderComponent } from 'src/app/shared-components/empty-placeholder/empty-placeholder.component';
import { pluginPagesPaths } from 'src/environments/plugin-config';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    MomentModule,

    // Angular Material
    MatProgressSpinnerModule,
    MatDividerModule,
    MatButtonModule,

    // Prosit
    CmTranslateModule,
    CmTranslateServiceModule,
    OrderDataModule,
    OrderMapperServiceModule,
    OrderServiceModule,
    OrderArticlesServiceModule,

    EmptyPlaceholderComponent,
  ],
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  @Input() order: PastOrder | OrderRequest;
  @Input() user: User = null;

  @Input() readonly = true;
  @Input() showOrderTopSummary = true;

  orderDeliveryData: OrderData = null;

  venues: OrderArticle[];
  foods: OrderArticle[];
  equipment: OrderArticle[];

  loading$: Observable<boolean>;
  activeOrderArticles$: Observable<PostOrderArticle[]>;

  constructor(
    private orderMapperService: OrderMapperService,
    private orderArticlesService: OrderArticlesService,
    private articlesService: ArticlesService,
    private orderService: OrderService,
    public cmTranslateService: CmTranslateService
  ) {}

  ngOnInit() {
    if (this.order) {
      this.orderDeliveryData = this.orderMapperService.mapPastOrderToOrderData(this.order);

      this.venues = this.orderMapperService.filterOrderArticlesByType(this.order.orderArticles, 'venue');
      this.foods = this.orderMapperService.filterOrderArticlesByType(this.order.orderArticles, 'food');
      this.equipment = this.orderMapperService.filterOrderArticlesByType(
        this.order.orderArticles,
        'equipment'
      );
    }

    if (!this.readonly) {
      this.activeOrderArticles$ = from(this.order.orderArticles || []).pipe(
        concatMap((orderArticle: OrderArticle) =>
          this.articlesService.queryArticle(orderArticle.article.id).pipe(
            filter((article: Article) => !!article),
            map(() => this.orderArticlesService.mapOrderArticleToPostOrderArticle(orderArticle))
          )
        ),
        toArray(),
        shareReplay(1)
      );

      const loadingStart$: Observable<boolean> = of(true);
      const loadingEnd$: Observable<boolean> = this.activeOrderArticles$.pipe(map(() => false));
      this.loading$ = merge(loadingStart$, loadingEnd$).pipe(startWith(true), shareReplay(1));
    }
  }

  getReorderWarningText(activeArticlesLength: number) {
    if (this.readonly) {
      return null;
    }

    return !this.user
      ? 'LOGIN_TO_REORDER'
      : !activeArticlesLength
      ? 'PAST_ORDER_ARTICLES_NOT_AVAILABLE'
      : activeArticlesLength < this.order.orderArticles.length
      ? 'PAST_ORDER_ARTICLES_PARTIALLY_AVAILABLE'
      : null;
  }

  isArticleAvailable(article: OrderArticle, activeArticles: PostOrderArticle[]): boolean {
    return activeArticles.findIndex((activeArticle) => activeArticle.articleId === article.id) >= 0;
  }

  reorder() {
    if (this.readonly) {
      return;
    }

    this.activeOrderArticles$
      .pipe(
        filter((orderArticles) => !!orderArticles.length),
        tap((orderArticles) => {
          this.orderArticlesService.setOrderArticles(orderArticles);

          const order: Order = this.orderMapperService.mapPastOrderToOrder(
            this.order,
            this.user,
            this.orderDeliveryData,
            orderArticles
          );
          this.orderService.setStoreOrder(order);

          window.location.href = window.location.origin + pluginPagesPaths.checkout;
        })
      )
      .subscribe();
  }
}
