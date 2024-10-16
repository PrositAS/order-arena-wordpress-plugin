import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import {
  ArticleGroup,
  ArticleGroupsFlattenedTree,
  ArticleGroupsFlattenedTreeNode,
  ArticleGroupsTree,
  ArticleGroupsTreeNode,
} from 'src/@types/order-arena-user-portal/ArticleGroup';
import { ArticleType } from 'src/@types/order-arena-user-portal/ArticleType';
import { ID } from 'src/@types/order-arena-user-portal/ID';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import {
  articleGroupsInfoQuery,
  getArticleGroups,
  setArticleGroupsAction,
} from 'src/app/@core/store/actions/article-groups';

@Injectable({
  providedIn: 'root',
})
export class ArticleGroupsService {
  constructor(
    private ngrx: Store<UPState>,
    private http: Apollo
  ) {
    this.queryArticleGroups().subscribe();
  }

  get articleGroups(): Observable<ArticleGroup[]> {
    return this.ngrx.pipe(select((store) => store.articleGroups));
  }

  getArticleGroups(onlyActive = false, articleType: ArticleType = 'food'): Observable<ArticleGroup[]> {
    return this.articleGroups.pipe(
      switchMap((articleGroups) => (!articleGroups ? this.queryArticleGroups() : of(articleGroups))),
      map((articleGroups: ArticleGroup[]) =>
        (onlyActive ? articleGroups.filter((articleGroup) => articleGroup.active) : articleGroups).filter(
          (articleGroup) => articleGroup.kind === articleType
        )
      )
    );
  }

  getArticleGroupById(id: ID, onlyActive = false): Observable<ArticleGroup> {
    return this.getArticleGroups(onlyActive).pipe(
      map((articleGroups) => this.findArticleGroupById(id, articleGroups))
    );
  }

  findArticleGroupById(id: ID, articleGroups: ArticleGroup[]): ArticleGroup {
    return articleGroups.find((articleGroup) => articleGroup.id === id) || null;
  }

  getFlattenedArticleGroupsTree(onlyActive = false): Observable<ArticleGroupsFlattenedTree> {
    return this.getArticleGroupsTree(onlyActive).pipe(
      map((articleGroupsTree) =>
        articleGroupsTree.map((node) => {
          const flattenedNode: ArticleGroupsFlattenedTreeNode = {
            group: node.group,
            childGroups: this.getFlattenedNodeChildren(node),
          };
          return flattenedNode;
        })
      )
    );
  }

  getChildArticleGroups(
    articleGroup: ArticleGroup = null,
    groupId: ID = null,
    onlyActive = false,
    deep = false
  ): Observable<ArticleGroup[]> {
    return this.getArticleGroupsTreeNode(articleGroup, groupId, onlyActive).pipe(
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
    groupId: ID = null,
    onlyActive = false
  ): Observable<ArticleGroupsTreeNode> {
    return articleGroup || groupId
      ? this.getArticleGroups(onlyActive).pipe(
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

  getArticleGroupsTree(onlyActive = false): Observable<ArticleGroupsTree> {
    return this.getArticleGroups(onlyActive).pipe(
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

  queryArticleGroups(infoOnly = true): Observable<any> {
    return this.http
      .query({
        query: infoOnly ? articleGroupsInfoQuery : getArticleGroups,
        context: { isPublic: true },
        variables: { ...(infoOnly && { active: true }) },
      })
      .pipe(
        map((result: ApolloQueryResult<{ articleGroups: { collection: ArticleGroup[] } }>) =>
          result.data && result.data.articleGroups && result.data.articleGroups.collection
            ? result.data.articleGroups.collection || []
            : []
        ),
        tap((articleGroups: ArticleGroup[]) => this.ngrx.dispatch(setArticleGroupsAction(articleGroups)))
      );
  }
}
