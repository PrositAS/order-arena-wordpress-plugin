import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-form-header',
  templateUrl: './order-form-header.component.html',
  styleUrls: ['./order-form-header.component.scss'],
})
export class OrderFormHeaderComponent {
  @Input() displayUserLogin = true;
}
