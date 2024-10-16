import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { OrderConfirmationComponent } from 'src/app/components/checkout/order-confirmation/order-confirmation/order-confirmation.component';
import { pluginPagesPaths } from 'src/environments/plugin-config';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatDialogModule,
    MatButtonModule,
    MatIconModule,

    // Prosit
    OrderConfirmationComponent,
  ],
  selector: 'app-order-confirmation-dialog',
  templateUrl: './order-confirmation-dialog.component.html',
  styleUrls: ['./order-confirmation-dialog.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class OrderConfirmationDialogComponent {
  redirectToProfile() {
    window.location.href = window.location.origin + pluginPagesPaths.profile;
  }
}
