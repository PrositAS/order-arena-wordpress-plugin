import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
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
  constructor(
    private ngrx: Store<UPState>,
    private http: Apollo,
    private articleGroupsService: ArticleGroupsService
  ) {}

  get articles(): Observable<ArticleGroup[]> {
    return this.ngrx.pipe(select((store) => store.articles));
  }

  getArticles(): Observable<ArticleGroup[]> {
    return this.articles.pipe(
      switchMap((articleGroups) => (!articleGroups ? this.queryArticleGroups() : of(articleGroups)))
    );
  }

  getGroupArticles(groupId: ID): Observable<ArticleInGroup[]> {
    return this.getArticles().pipe(
      switchMap((articleGroups) => {
        if (groupId) {
          const articleGroup: ArticleGroup = articleGroups.find(
            (articleGroup) => articleGroup.id === groupId
          );

          return articleGroup
            ? !articleGroup.articles
              ? this.queryGroupArticles(articleGroup.id)
              : of(articleGroup.articles)
            : of([]);
        }

        return of([]);
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

  queryGroupArticles(groupID: ID): Observable<ArticleInGroup[]> {
    return this.http
      .query({
        query: groupArticlesQuery,
        context: { isPublic: true },
        variables: { id: groupID },
      })
      .pipe(
        map((result: ApolloQueryResult<{ articleGroups: { collection: ArticleGroup[] } }>) => {
          return result.data &&
            result.data.articleGroups &&
            result.data.articleGroups.collection &&
            result.data.articleGroups.collection[0]
            ? result.data.articleGroups.collection[0].articles
            : [];
        }),
        map((articles: ArticleInGroup[]) =>
          articles.length > 1 ? [...articles].sort((a, b) => this.sortByPosition(a, b)) : articles
        ),
        tap((articles: ArticleInGroup[]) =>
          this.ngrx.dispatch(setGroupArticlesAction(null, groupID, articles))
        )
      );
  }
}
