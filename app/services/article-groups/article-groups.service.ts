import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import {
  ArticleGroup,
  ArticleGroupsTree,
  ArticleGroupsTreeNode,
} from 'src/@types/order-arena-user-portal/ArticleGroup';
import { ArticleType } from 'src/@types/order-arena-user-portal/ArticleType';
import { ID } from 'src/@types/order-arena-user-portal/ID';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import {
  articleGroupInfoQuery,
  articleGroupQuery,
  articleGroupsInfoQuery,
  articleGroupsQuery,
  setArticleGroupsAction,
} from 'src/app/@core/store/actions/article-groups';
import { setArticlesGroupsAction, updateArticlesGroupAction } from 'src/app/@core/store/actions/articles';

@Injectable({
  providedIn: 'root',
})
export class ArticleGroupsService {
  constructor(
    private ngrx: Store<UPState>,
    private http: Apollo
  ) {}

  get articleGroups(): Observable<ArticleGroup[]> {
    return this.ngrx.pipe(select((store) => store.articleGroups));
  }

  getArticleGroups(articleType: ArticleType = null, onlyActive = false): Observable<ArticleGroup[]> {
    return this.articleGroups.pipe(
      switchMap((articleGroups) => (!articleGroups ? this.queryArticleGroups() : of(articleGroups))),
      map((articleGroups: ArticleGroup[]) =>
        articleGroups.filter(
          (articleGroup) =>
            (articleType ? articleGroup.kind === articleType : true) &&
            (onlyActive ? !!articleGroup.active : true)
        )
      )
    );
  }

  getArticleGroupById(id: ID): Observable<ArticleGroup> {
    return this.getArticleGroups().pipe(map((articleGroups) => this.findArticleGroupById(id, articleGroups)));
  }

  findArticleGroupById(id: ID, articleGroups: ArticleGroup[]): ArticleGroup {
    return articleGroups.find((articleGroup) => articleGroup.id === id) || null;
  }

  getChildArticleGroups(
    articleGroup: ArticleGroup = null,
    groupId: ID = null,
    deep = false
  ): Observable<ArticleGroup[]> {
    return this.getArticleGroupsTreeNode(articleGroup, groupId).pipe(
      map((node) =>
        deep
          ? this.getFlattenedNodeChildren(node)
          : node.childGroups.filter((childNode) => childNode.group).map((childNode) => childNode.group)
      )
    );
  }

  getFlattenedNodeChildren(node: ArticleGroupsTreeNode): ArticleGroup[] {
    return node && node.group && node.childGroups
      ? node.childGroups.reduce(
          (flattenedGroups, childNode) =>
            !childNode.childGroups.length
              ? [...flattenedGroups, childNode.group]
              : [...flattenedGroups, childNode.group, ...this.getFlattenedNodeChildren(childNode)],
          []
        )
      : null;
  }

  findMainArticleGroups(articleGroups: ArticleGroup[]): ArticleGroup[] {
    return this.findChildArticleGroups(articleGroups);
  }

  buildArticleGroupTreeNode(
    articleGroups: ArticleGroup[],
    articleGroup: ArticleGroup
  ): ArticleGroupsTreeNode {
    if (articleGroup) {
      const node: ArticleGroupsTreeNode = { group: articleGroup, childGroups: [] };
      const childGroups: ArticleGroup[] = this.findChildArticleGroups(articleGroups, articleGroup);

      if (!!childGroups.length) {
        node.childGroups = childGroups.map((child) => this.buildArticleGroupTreeNode(articleGroups, child));
      }

      return node;
    }

    return null;
  }

  getArticleGroupsTreeNode(
    articleGroup: ArticleGroup = null,
    groupId: ID = null
  ): Observable<ArticleGroupsTreeNode> {
    return articleGroup || groupId
      ? this.getArticleGroups().pipe(
          map((articleGroups) =>
            this.buildArticleGroupTreeNode(
              articleGroups,
              articleGroup ? articleGroup : this.findArticleGroupById(groupId, articleGroups)
            )
          )
        )
      : of(null);
  }

  buildArticleGroupsTree(articleGroups: ArticleGroup[]): ArticleGroupsTree {
    return this.findMainArticleGroups(articleGroups).map((mainGroup) =>
      this.buildArticleGroupTreeNode(articleGroups, mainGroup)
    );
  }

  getArticleGroupsTree(): Observable<ArticleGroupsTree> {
    return this.getArticleGroups().pipe(
      map((articleGroups) => this.buildArticleGroupsTree(articleGroups)),
      shareReplay(1)
    );
  }

  private findChildArticleGroups(
    articleGroups: ArticleGroup[],
    articleGroup: ArticleGroup = null
  ): ArticleGroup[] {
    return [
      ...(articleGroup
        ? articleGroups.filter((group) => group.articleGroupId === articleGroup.id)
        : articleGroups.filter((group) => !group.articleGroupId)),
    ].sort((a, b) => this.sortByPosition(a, b));
  }

  private sortByPosition(a: ArticleGroup, b: ArticleGroup): number {
    return a.position && b.position ? a.position - b.position : 1;
  }

  queryArticleGroup(id: ID, infoOnly = true, updateStore = true): Observable<ArticleGroup> {
    return this.http
      .query({
        query: infoOnly ? articleGroupInfoQuery : articleGroupQuery,
        context: { isPublic: true },
        variables: { ...(id && { id }) },
      })
      .pipe(
        map(
          (result: ApolloQueryResult<{ articleGroups: { collection: ArticleGroup[] } }>) =>
            result.data?.articleGroups?.collection?.[0] ?? null
        ),
        tap((articleGroup: ArticleGroup) => {
          if (updateStore && !infoOnly) {
            this.ngrx.dispatch(updateArticlesGroupAction(articleGroup));
          }
        })
      );
  }

  queryArticleGroups(infoOnly = true): Observable<ArticleGroup[]> {
    return this.http
      .query({
        query: infoOnly ? articleGroupsInfoQuery : articleGroupsQuery,
        context: { isPublic: true },
      })
      .pipe(
        map(
          (result: ApolloQueryResult<{ articleGroups: { collection: ArticleGroup[] } }>) =>
            result.data?.articleGroups?.collection ?? []
        ),
        tap((articleGroups: ArticleGroup[]) =>
          this.ngrx.dispatch(
            infoOnly ? setArticleGroupsAction(articleGroups) : setArticlesGroupsAction(articleGroups)
          )
        )
      );
  }
}
