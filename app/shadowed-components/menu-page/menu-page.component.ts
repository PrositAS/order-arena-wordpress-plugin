import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { map, Observable, shareReplay, startWith } from 'rxjs';
import { ArticleType } from 'src/@types/order-arena-user-portal/ArticleType';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { CmTranslateService } from 'src/app/services/cm-translate/cm-translate.service';
import { OverlaySpinnerModule } from 'src/app/shared-components/overlay-spinner/overlay-spinner.module';
import { BasketButtonComponent } from '../../components/basket/basket-button/basket-button.component';
import { BasketComponent } from '../../components/basket/basket/basket.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatSidenavModule,

    // Prosit
    CmTranslateModule,

    OverlaySpinnerModule,
    BasketComponent,
    BasketButtonComponent,
    MenuComponent,
  ],
  selector: 'app-menu-page',
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class MenuPageComponent implements OnInit {
  shouldOpenBasket: boolean = true;
  showBasketWidth: number = 768;

  articleType: ArticleType = 'food';

  hidden$: Observable<boolean>;

  constructor(
    private elementRef: ElementRef,
    private cmTranslateService: CmTranslateService
  ) {
    this.hidden$ = this.cmTranslateService.loaded$.pipe(
      startWith(false),
      map((loaded) => !loaded),
      shareReplay(1)
    );
  }

  ngOnInit() {
    this.onResize(window.innerWidth);

    this.articleType = this.elementRef.nativeElement.getAttribute('article-type') || 'food';
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    this.shouldOpenBasket = width >= this.showBasketWidth;
  }
}
