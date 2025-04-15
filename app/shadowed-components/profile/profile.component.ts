import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter, map, Observable, of, shareReplay, startWith, switchMap, take, tap } from 'rxjs';
import { AuthService } from 'src/app/@core/auth.service';
import { OrdersComponent } from 'src/app/components/orders/orders/orders.component';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { CmTranslateService } from 'src/app/services/cm-translate/cm-translate.service';
import { OverlaySpinnerModule } from 'src/app/shared-components/overlay-spinner/overlay-spinner.module';
import { LoginComponent } from '../../components/login/login/login.component';
import { UserLoginButtonComponent } from '../../components/login/user-login-button/user-login-button.component';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';

const ProfileTabs = ['PROFILE_PAST_ORDERS'] as const;
type ProfileTab = (typeof ProfileTabs)[number];

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

  tabs = ProfileTabs;
  activeTab: ProfileTab = this.tabs[0];

  constructor(
    private authService: AuthService,
    private cmTranslateService: CmTranslateService,
    @Inject(DOCUMENT) private document: Document,
    private dialog: MatDialog
  ) {
    this.hidden$ = this.cmTranslateService.loaded$.pipe(
      startWith(false),
      map((loaded) => !loaded),
      shareReplay(1)
    );
  }

  ngOnInit(): void {
    this.loggedIn$ = this.authService.loggedIn.pipe(shareReplay(1));

    this.loggedIn$
      .pipe(
        filter((loggedIn) => !loggedIn),
        switchMap(() => of(new URL(this.document.location.href))),
        filter((url) => url.hash === '#updatePassword'),
        take(1),
        tap((url) => {
          const token = url.searchParams.get('token');
          if (token) {
            this.dialog.open(PasswordDialogComponent, { data: { token }, width: '98vw', maxWidth: '98vw' });
          }
        })
      )
      .subscribe();
  }
}
