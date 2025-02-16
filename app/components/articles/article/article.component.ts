import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Article } from 'src/@types/order-arena-user-portal/Article';
import { PostOrderArticle } from 'src/@types/order-arena-user-portal/params/PostOrder';
import { OrderArticlesService } from 'src/app/services/order-articles/order-articles.service';
import { ArticleDetailsDialogComponent } from 'src/app/shadowed-components/article-details-dialog/article-details-dialog.component';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  @Input() article: Article;

  orderArticle$: Observable<PostOrderArticle>;
  displayQuantity$: Observable<boolean>;
  quantity: number = null;

  constructor(
    private orderArticlesService: OrderArticlesService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.orderArticle$ = this.orderArticlesService.getOrderArticleById(this.article.id).pipe(shareReplay(1));
    this.displayQuantity$ = this.orderArticle$.pipe(
      map((orderArticle) => {
        if (orderArticle && orderArticle.quantity) {
          this.quantity = orderArticle.quantity;

          return true;
        }

        return false;
      })
    );
  }

  addOrderArticle() {
    this.orderArticlesService.addOrderArticle(this.article);
  }

  showArticleDetails() {
    this.dialog.open(ArticleDetailsDialogComponent, { data: { article: this.article } });
  }
}
