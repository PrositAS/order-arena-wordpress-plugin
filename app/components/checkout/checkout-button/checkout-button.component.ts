import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { Observable, startWith } from 'rxjs';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { BasketServiceModule } from 'src/app/services/basket/basket-service.module';
import { BasketService } from 'src/app/services/basket/basket.service';
import { pluginPagesPaths } from 'src/environments/plugin-config';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatButtonModule,

    // Prosit
    CmTranslateModule,
    BasketServiceModule,
  ],
  selector: 'app-checkout-button',
  templateUrl: './checkout-button.component.html',
  styleUrls: ['./checkout-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutButtonComponent implements OnInit {
  @Input() color: ThemePalette = 'primary';

  isEmpty$: Observable<boolean>;

  checkoutUrl: string = window.location.origin + pluginPagesPaths.checkout;

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.isEmpty$ = this.basketService.isEmpty().pipe(startWith(true));
  }
}
