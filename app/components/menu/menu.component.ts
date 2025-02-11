import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter, map, Observable, shareReplay, startWith, take, tap, zip } from 'rxjs';
import {
  ArticleGroup,
  ArticleGroupsTree,
  ArticleGroupsTreeNode,
} from 'src/@types/order-arena-user-portal/ArticleGroup';
import { ArticleType } from 'src/@types/order-arena-user-portal/ArticleType';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ArticleGroupsService } from 'src/app/services/article-groups/article-groups.service';
import { ArticlesService } from 'src/app/services/articles/articles.service';
import { PluginSettingsService } from 'src/app/services/plugin-settings/plugin-settings.service';
import { ViewActionsService } from 'src/app/services/view-actions/view-actions.service';
import { EmptyPlaceholderComponent } from 'src/app/shared-components/empty-placeholder/empty-placeholder.component';
import { ArticleGroupsModule } from '../article-groups/article-groups.module';
import { UserLoginButtonComponent } from '../login/user-login-button/user-login-button.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatToolbarModule,
    MatTabsModule,
    MatProgressSpinnerModule,

    // Prosit
    CmTranslateModule,

    UserLoginButtonComponent,
    ArticleGroupsModule,
    EmptyPlaceholderComponent,
  ],
  providers: [PluginSettingsService, ViewActionsService],
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() articleType: ArticleType = 'food';

  imageHeaderUrl$: Observable<string>;
  articleGroups$: Observable<ArticleGroup[]>;
  articleGroupsTree$: Observable<ArticleGroupsTree>;

  activeGroup: ArticleGroup = null;
  activeGroupIndex: number = 0;
  activeGroupHash: string;
  loading = true;

  constructor(
    private articleGroupsService: ArticleGroupsService,
    private articlesService: ArticlesService,
    private pluginSettingsService: PluginSettingsService,
    private viewActionsService: ViewActionsService
  ) {}

  ngOnInit(): void {
    this.imageHeaderUrl$ = this.pluginSettingsService.getImageUrl('menu').pipe(startWith(null));
    this.articleGroups$ = this.articleGroupsService
      .getArticleGroups(this.articleType, true)
      .pipe(shareReplay(1));
    this.articleGroupsTree$ = this.articleGroups$.pipe(
      map((articleGroups) => this.articleGroupsService.buildArticleGroupsTree(articleGroups)),
      tap((articleGroupsTree) => {
        this.loading = false;
        if (!!articleGroupsTree.length) {
          this.activeGroup = articleGroupsTree[0] ? articleGroupsTree[0].group : null;
        }
      }),
      shareReplay(1)
    );

    zip(
      this.articleGroupsTree$.pipe(take(1)),
      this.articlesService.articlesLoaded$.pipe(filter((articlesLoaded) => articlesLoaded))
    )
      .pipe(
        take(1),
        tap(([articleGroupsTree]) => {
          const locationHash = window.location.hash;
          if (!locationHash) {
            return;
          }

          const groupIndex: number = articleGroupsTree.findIndex(
            (group) => group.group.name === decodeURIComponent(locationHash).replace('#', '')
          );
          if (groupIndex === -1) {
            return;
          }

          this.activeGroupIndex = groupIndex;
          const node: ArticleGroupsTreeNode = articleGroupsTree[groupIndex];
          if (node?.group?.id) {
            this.viewActionsService.scrollToIdInPage(`articleGroup-${node.group.id}`, 'menu-page');
          }
        })
      )
      .subscribe();
  }

  getChildArticleGroups(articleGroup: ArticleGroupsTreeNode): ArticleGroup[] {
    return this.articleGroupsService.getFlattenedNodeChildren(articleGroup);
  }

  scrollToActiveArticleGroup(groupIndex: number) {
    if (groupIndex >= 0) {
      this.articleGroupsTree$
        .pipe(
          take(1),
          tap((articleGroupsTree) => {
            if (groupIndex < articleGroupsTree.length) {
              this.activeGroupIndex = groupIndex;

              const node: ArticleGroupsTreeNode = articleGroupsTree[groupIndex];
              if (node?.group?.id) {
                this.viewActionsService.scrollToIdInPage(`articleGroup-${node.group.id}`, 'menu-page');
              }
            }
          })
        )
        .subscribe();
    }
  }
}
