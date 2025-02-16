import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import {
  concatMap,
  filter,
  finalize,
  map,
  switchMap,
  take,
  tap,
  toArray,
  withLatestFrom,
} from 'rxjs/operators';
import { Article } from 'src/@types/order-arena-user-portal/Article';
import { ArticleGroup } from 'src/@types/order-arena-user-portal/ArticleGroup';
import { ArticleInGroup } from 'src/@types/order-arena-user-portal/ArticleInGroup';
import { ID } from 'src/@types/order-arena-user-portal/ID';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import {
  articleQuery,
  groupArticlesQuery,
  setGroupArticlesAction,
} from 'src/app/@core/store/actions/articles';
import { ArticleGroupsService } from '../article-groups/article-groups.service';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  articlesLoaded$ = new BehaviorSubject<boolean>(false);

  constructor(
    private ngrx: Store<UPState>,
    private http: Apollo,
    private articleGroupsService: ArticleGroupsService
  ) {
    this.articleGroupsService
      .queryArticleGroups()
      .pipe(
        take(1),
        switchMap((articleGroups) => from(articleGroups)),
        withLatestFrom(this.getArticles().pipe(take(1))),
        map(([articleGroup, articles]) => [
          articleGroup,
          articles.find((article) => article.id === articleGroup.id),
        ]),
        filter(
          ([articleGroup, article]) =>
            !article || new Date(articleGroup?.updatedAt).valueOf() !== new Date(article?.updatedAt).valueOf()
        ),
        concatMap(([articleGroup]) => this.articleGroupsService.queryArticleGroup(articleGroup.id, false)),
        toArray(),
        finalize(() => this.articlesLoaded$.next(true))
      )
      .subscribe();
  }

  get articles(): Observable<ArticleGroup[]> {
    return this.ngrx.pipe(select((store) => store.articles));
  }

  getArticles(): Observable<ArticleGroup[]> {
    return this.articles;
  }

  getGroupArticles(groupId: ID): Observable<ArticleInGroup[]> {
    return this.getArticles().pipe(
      switchMap((articleGroups) => {
        if (!groupId) {
          return of([]);
        }

        const articleGroup: ArticleGroup = articleGroups.find((articleGroup) => articleGroup.id === groupId);

        return articleGroup
          ? !articleGroup.articles
            ? this.queryGroupArticles(articleGroup.id)
            : of(articleGroup.articles)
          : of(null);
      })
    );
  }

  private sortByPosition(a: ArticleInGroup, b: ArticleInGroup): number {
    return a.position && b.position ? a.position - b.position : 1;
  }

  queryArticle(id: ID): Observable<Article> {
    return this.http
      .query({
        query: articleQuery,
        context: { isPublic: true },
        variables: { id },
      })
      .pipe(
        map(
          (result: ApolloQueryResult<{ articles: { collection: Article[] } }>) =>
            result.data?.articles?.collection[0]
        )
      );
  }

  queryArticleGroups(): Observable<ArticleGroup[]> {
    return this.articleGroupsService.queryArticleGroups();
  }

  queryGroupArticles(groupID: ID, updateStore = true): Observable<ArticleInGroup[]> {
    return this.http
      .query({
        query: groupArticlesQuery,
        context: { isPublic: true },
        variables: { id: groupID },
      })
      .pipe(
        map(
          (result: ApolloQueryResult<{ articleGroups: { collection: ArticleGroup[] } }>) =>
            result.data?.articleGroups?.collection?.[0].articles ?? []
        ),
        map((articles: ArticleInGroup[]) =>
          articles.length > 1 ? [...articles].sort((a, b) => this.sortByPosition(a, b)) : articles
        ),
        tap((articles: ArticleInGroup[]) => {
          if (updateStore) {
            this.ngrx.dispatch(setGroupArticlesAction(null, groupID, articles));
          }
        })
      );
  }
}
