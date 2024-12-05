import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [
    // Angular Material
    MatIconModule,
    MatButtonModule,
  ],
  selector: 'app-basket-button',
  templateUrl: './basket-button.component.html',
  styleUrls: ['./basket-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketButtonComponent {}
