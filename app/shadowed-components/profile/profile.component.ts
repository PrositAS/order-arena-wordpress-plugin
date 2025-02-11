import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { map, Observable, shareReplay, startWith } from 'rxjs';
import { AuthService } from 'src/app/@core/auth.service';
import { OrdersComponent } from 'src/app/components/orders/orders/orders.component';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { CmTranslateService } from 'src/app/services/cm-translate/cm-translate.service';
import { OverlaySpinnerModule } from 'src/app/shared-components/overlay-spinner/overlay-spinner.module';
import { LoginComponent } from '../../components/login/login/login.component';
import { UserLoginButtonComponent } from '../../components/login/user-login-button/user-login-button.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatToolbarModule,
    MatTabsModule,

    // Prosit
    CmTranslateModule,

    OverlaySpinnerModule,
    UserLoginButtonComponent,
    LoginComponent,
    OrdersComponent,
  ],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ProfileComponent implements OnInit {
  loggedIn$: Observable<boolean>;
  hidden$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private cmTranslateService: CmTranslateService
  ) {
    this.hidden$ = this.cmTranslateService.loaded$.pipe(
      startWith(false),
      map((loaded) => !loaded),
      shareReplay(1)
    );
  }

  ngOnInit(): void {
    this.loggedIn$ = this.authService.loggedIn.pipe(startWith(false), shareReplay(1));
  }
}
