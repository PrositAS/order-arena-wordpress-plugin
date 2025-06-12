import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, startWith } from 'rxjs';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { AuthService } from '../../../@core/auth.service';
import { LoginButtonComponent } from '../login-button/login-button.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Prosit
    CmTranslateModule,
    LoginButtonComponent,
  ],
  selector: 'app-user-login-button',
  templateUrl: './user-login-button.component.html',
  styleUrls: ['./user-login-button.component.scss'],
})
export class UserLoginButtonComponent implements OnInit {
  @Input() displayText = true;

  loggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loggedIn$ = this.authService.loggedIn.pipe(startWith(false));
  }

  displayUser(): Observable<string> {
    return this.authService.displayUser.pipe();
  }
}
