import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { map, Observable, shareReplay, startWith } from 'rxjs';
import { OrderFormModule } from 'src/app/components/checkout/order-form/order-form.module';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { CmTranslateService } from 'src/app/services/cm-translate/cm-translate.service';
import { OverlaySpinnerModule } from 'src/app/shared-components/overlay-spinner/overlay-spinner.module';
import { BasketButtonComponent } from '../../components/basket/basket-button/basket-button.component';
import { BasketComponent } from '../../components/basket/basket/basket.component';

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
    OrderFormModule,
  ],
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CheckoutPageComponent {
  shouldOpenBasket: boolean = true;
  showBasketWidth: number = 768;

  hidden$: Observable<boolean>;

  constructor(private cmTranslateService: CmTranslateService) {
    this.hidden$ = this.cmTranslateService.loaded$.pipe(
      startWith(false),
      map((loaded) => !loaded),
      shareReplay(1)
    );
  }

  ngOnInit() {
    this.onResize(window.innerWidth);
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    this.shouldOpenBasket = width >= this.showBasketWidth;
  }
}
