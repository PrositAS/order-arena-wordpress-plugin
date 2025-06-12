import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable, startWith } from 'rxjs';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { LoginDialogComponent } from 'src/app/shadowed-components/login-dialog/login-dialog.component';
import { AuthService } from '../../../@core/auth.service';

type ButtonMode = 'link' | 'button';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatButtonModule,
    MatDialogModule,
    MatIconModule,

    // Prosit
    CmTranslateModule,

    LoginDialogComponent,
  ],
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss'],
})
export class LoginButtonComponent implements OnInit {
  @Input() color: ThemePalette = 'primary';
  @Input() mode: ButtonMode = 'button';
  @Input() logInSuffix: string = null;

  loggedIn$: Observable<boolean>;

  destroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loggedIn$ = this.authService.loggedIn.pipe(takeUntilDestroyed(this.destroyRef), startWith(false));
  }

  showLoginForm() {
    this.dialog.open(LoginDialogComponent, {
      id: 'login-dialog',
      height: '98vh',
      width: '98vw',
      maxWidth: '98vw',
      panelClass: 'login-dialog',
      disableClose: true,
    });
  }

  logout() {
    this.authService.logout();
  }
}
