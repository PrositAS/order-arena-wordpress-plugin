import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { LoginFormComponent } from 'src/app/components/login/login-form/login-form.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    LoginFormComponent,
  ],

  selector: 'app-shadowed-login-form',
  templateUrl: './shadowed-login-form.component.html',
  styleUrls: ['./shadowed-login-form.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ShadowedLoginFormComponent {
  @Input() color: ThemePalette = 'primary';
  @Output() validated = new EventEmitter<boolean>();
}
