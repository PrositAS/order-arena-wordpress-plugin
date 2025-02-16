import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Observable, startWith } from 'rxjs';
import { OrderRequest } from 'src/@types/order-arena-user-portal/OrderRequest';
import { OrderSummaryComponent } from 'src/app/components/orders/order-summary/order-summary.component';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { PluginSettingsService } from 'src/app/services/plugin-settings/plugin-settings.service';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatCardModule,
    MatDividerModule,

    // Prosit
    CmTranslateModule,

    OrderSummaryComponent,
  ],
  providers: [PluginSettingsService],
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent {
  @Input() orderRequest: OrderRequest;

  imageHeaderUrl$: Observable<string>;

  constructor(private pluginSettingsService: PluginSettingsService) {
    this.imageHeaderUrl$ = this.pluginSettingsService.getImageUrl('order_confirmation').pipe(startWith(null));
  }
}
