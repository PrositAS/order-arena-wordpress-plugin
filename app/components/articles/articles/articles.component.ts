import { Component, Input, OnInit } from '@angular/core';
import { merge, Observable, of } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { ArticleGroup } from 'src/@types/order-arena-user-portal/ArticleGroup';
import { ArticleInGroup } from 'src/@types/order-arena-user-portal/ArticleInGroup';
import { ArticlesService } from '../../../services/articles/articles.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  @Input() group: ArticleGroup = null;

  loading$: Observable<boolean>;
  articlesInGroup$: Observable<ArticleInGroup[]>;

  constructor(private articlesService: ArticlesService) {}

  ngOnInit() {
    if (this.group) {
      this.articlesInGroup$ = !this.group.articles
        ? this.articlesService.getGroupArticles(this.group.id)
        : of(this.group.articles);

      const loadingStart$: Observable<boolean> = of(true);
      const loadingEnd$: Observable<boolean> = this.articlesInGroup$.pipe(map(() => false));
      this.loading$ = merge(loadingStart$, loadingEnd$).pipe(startWith(true), shareReplay(1));
    }
  }
}
