import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
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
import { OrderLogAction } from 'src/@types/order-arena-user-portal/OrderLogAction';
import { PostOrderArticle } from 'src/@types/order-arena-user-portal/params/PostOrder';
import { User } from 'src/@types/order-arena-user-portal/User';
import { ArticlesService } from 'src/app/services/articles/articles.service';
import { CmTranslateService } from 'src/app/services/cm-translate/cm-translate.service';
import { OrderArticlesService } from 'src/app/services/order-articles/order-articles.service';
import { OrderMapperService } from 'src/app/services/order/order-mapper/order-mapper.service';
import { OrderService } from 'src/app/services/order/order/order.service';
import { pluginPagesPaths } from 'src/environments/plugin-config';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  @Input() order: PastOrder;
  @Input() index: number;
  @Input() user: User = null;

  orderTime: Moment = null;
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
      const orderTimeAction: OrderLogAction = this.order.actionsCompleted.find(
        (action) => action.name === 'Received' || action.name === 'Confirmed'
      );
      this.orderTime = orderTimeAction ? moment(orderTimeAction.changedAt) : null;

      this.orderDeliveryData = this.orderMapperService.mapPastOrderToOrderData(this.order);

      this.venues = this.orderMapperService.filterOrderArticlesByType(this.order.orderArticles, 'venue');
      this.foods = this.orderMapperService.filterOrderArticlesByType(this.order.orderArticles, 'food');
      this.equipment = this.orderMapperService.filterOrderArticlesByType(
        this.order.orderArticles,
        'equipment'
      );
    }

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

  getReorderWarningText(activeArticlesLength: number) {
    return this.user === null
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
