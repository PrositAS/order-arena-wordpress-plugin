import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Observable, startWith } from 'rxjs';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { PluginSettingsService } from 'src/app/services/plugin-settings/plugin-settings.service';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatCardModule,

    // Prosit
    CmTranslateModule,
  ],
  providers: [PluginSettingsService],
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent {
  imageHeaderUrl$: Observable<string>;

  constructor(private pluginSettingsService: PluginSettingsService) {
    this.imageHeaderUrl$ = this.pluginSettingsService.getImageUrl('order_confirmation').pipe(startWith(null));
  }
}
