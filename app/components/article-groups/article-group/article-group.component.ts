import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { map, merge, Observable, of, shareReplay, startWith, switchMap } from 'rxjs';
import { ArticleGroup } from 'src/@types/order-arena-user-portal/ArticleGroup';
import { ArticleGroupsService } from '../../../services/article-groups/article-groups.service';

@Component({
  selector: 'app-article-group',
  templateUrl: './article-group.component.html',
  styleUrls: ['./article-group.component.scss'],
})
export class ArticleGroupComponent implements OnInit {
  @Input() mainGroup = true;
  @Input() group: ArticleGroup = null;
  @Input() childGroups: ArticleGroup[] = null;
  groupId: string | undefined = null;

  loading$: Observable<boolean>;
  articleGroup$: Observable<ArticleGroup>;
  childArticleGroups$: Observable<ArticleGroup[]>;
  groupHasSubgroups$: Observable<boolean>;

  constructor(
    private elementRef: ElementRef,
    private articleGroupsService: ArticleGroupsService
  ) {}

  ngOnInit() {
    // NOTE: workaround for web component attribute
    this.groupId = this.elementRef.nativeElement.getAttribute('group');

    this.articleGroup$ = (
      this.group
        ? of(this.group)
        : this.groupId
        ? this.articleGroupsService.getArticleGroupById(this.groupId)
        : of(null)
    ).pipe(shareReplay(1));

    this.childArticleGroups$ = (
      this.mainGroup
        ? this.childGroups
          ? of(this.childGroups)
          : this.articleGroup$.pipe(
              switchMap((articleGroup) =>
                this.articleGroupsService.getChildArticleGroups(articleGroup, null, true)
              )
            )
        : of([])
    ).pipe(shareReplay(1));

    this.groupHasSubgroups$ = this.childArticleGroups$.pipe(
      map((childGroups) => !!childGroups?.length),
      shareReplay(1)
    );

    const loadingStart$: Observable<boolean> = of(true);
    const loadingEnd$: Observable<boolean> = this.childArticleGroups$.pipe(map(() => false));
    this.loading$ = merge(loadingStart$, loadingEnd$).pipe(startWith(true), shareReplay(1));
  }
}
