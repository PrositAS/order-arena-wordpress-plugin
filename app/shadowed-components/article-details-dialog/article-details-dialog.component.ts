import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  take,
  tap,
  zip,
} from 'rxjs';
import { Article } from 'src/@types/order-arena-user-portal/Article';
import { ID } from 'src/@types/order-arena-user-portal/ID';
import { PostOrderArticle } from 'src/@types/order-arena-user-portal/params/PostOrder';
import { Product } from 'src/@types/order-arena-user-portal/Product';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { OrderArticlesServiceModule } from 'src/app/services/order-articles/order-articles-service.module';
import { OrderArticlesService } from 'src/app/services/order-articles/order-articles.service';
import { AllergensListComponent } from 'src/app/shared-components/allergens-list/allergens-list.component';
import { EmptyPlaceholderComponent } from 'src/app/shared-components/empty-placeholder/empty-placeholder.component';
import { QuantityControlsComponent } from 'src/app/shared-components/quantity-controls/quantity-controls.component';

export interface DialogData {
  article: Article;
}

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,

    // Prosit
    CmTranslateModule,
    OrderArticlesServiceModule,

    AllergensListComponent,
    QuantityControlsComponent,
    EmptyPlaceholderComponent,
  ],
  selector: 'app-article-details-dialog',
  templateUrl: './article-details-dialog.component.html',
  styleUrls: ['./article-details-dialog.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ArticleDetailsDialogComponent implements OnInit {
  article$: BehaviorSubject<Article>;
  updatedQuantity$: Subject<number>;

  mappedArticle$: Observable<PostOrderArticle>;
  syncWithStore$: Observable<boolean>;
  product$: Observable<Product>;

  isFood$: Observable<boolean>;
  hasAllergens$: Observable<boolean>;
  imageUrl$: Observable<string>;
  name$: Observable<string>;
  description$: Observable<string>;
  childArticles$: Observable<Article[]>;

  articlePrice$: Observable<number>;
  minPersons$: Observable<number>;
  quantity$: Observable<number>;
  price$: Observable<number>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private orderArticlesService: OrderArticlesService
  ) {
    this.article$ = new BehaviorSubject<Article>(null);
    this.updatedQuantity$ = new Subject<number>();

    const article$ = this.article$.asObservable().pipe(
      filter((article) => !!article),
      shareReplay(1)
    );
    const articleId$: Observable<ID> = article$.pipe(
      map((article) => article.id),
      shareReplay(1)
    );

    const orderArticle$: Observable<PostOrderArticle> = articleId$.pipe(
      switchMap((articleId) => this.orderArticlesService.getOrderArticleById(articleId)),
      shareReplay(1)
    );
    this.mappedArticle$ = orderArticle$.pipe(
      switchMap((orderArticle) =>
        !orderArticle
          ? article$.pipe(map((article) => this.orderArticlesService.mapArticleToPostOrderArticle(article)))
          : of(orderArticle)
      ),
      shareReplay(1)
    );
    this.syncWithStore$ = orderArticle$.pipe(
      map((orderArticle) => !!orderArticle),
      shareReplay(1)
    );
    this.product$ = article$.pipe(
      map((article) => article.food || article.equipment || article.venue),
      shareReplay(1)
    );

    this.isFood$ = article$.pipe(
      map((article) => !!article.food),
      shareReplay(1)
    );
    this.hasAllergens$ = this.isFood$.pipe(
      filter((isFood) => isFood),
      switchMap(() => article$.pipe(map((article) => !!article.food.allergens.length)))
    );
    this.imageUrl$ = article$.pipe(
      map((article) => article.images?.[0]?.url),
      shareReplay(1)
    );
    this.name$ = this.product$.pipe(
      map((product) => product.name),
      shareReplay(1)
    );
    this.description$ = this.product$.pipe(
      map((product) => product.description),
      shareReplay(1)
    );
    this.childArticles$ = article$.pipe(map((article) => article.childArticles ?? []));

    this.articlePrice$ = article$.pipe(
      map((article) => article.priceMva),
      shareReplay(1)
    );
    this.minPersons$ = this.article$.pipe(
      map((article) => article.minPersons),
      shareReplay(1)
    );
    const articleQuantity$ = this.mappedArticle$.pipe(map((orderArticle) => orderArticle?.quantity));
    this.quantity$ = merge(articleQuantity$, this.updatedQuantity$).pipe(
      shareReplay(1),
      takeUntilDestroyed()
    );
    this.quantity$.subscribe();
    this.price$ = combineLatest([this.articlePrice$, this.quantity$]).pipe(
      map(([articlePrice, quantity]) => articlePrice * quantity),
      shareReplay(1)
    );
  }

  ngOnInit() {
    if (this.data.article) {
      this.article$.next(this.data.article);
    }
  }

  updateQuantity(quantity: number) {
    this.updatedQuantity$.next(quantity);
  }

  addOrderArticle() {
    zip(this.article$, this.quantity$)
      .pipe(
        take(1),
        tap(([article, quantity]) => this.orderArticlesService.addOrderArticle(article, quantity))
      )
      .subscribe();
  }
}
