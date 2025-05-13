import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ViewActionsService } from 'src/app/services/view-actions/view-actions.service';
import { appRevision, appVersion } from 'src/environments/version';
import { RegisterButtonComponent } from '../../register/register-button/register-button.component';
import { LoginFormComponent } from '../login-form/login-form.component';

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
    CmTranslateModule,

    LoginFormComponent,
    RegisterButtonComponent,
  ],
  providers: [ViewActionsService],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Input() standalone = false;
  @Input() inDialog = true;
  @Input() shadowRootId: string = null;
  @Output() validated = new EventEmitter<boolean>();

  version = appVersion;
  rev = appRevision.slice(0, 6);

  constructor(private viewActionsService: ViewActionsService) {}

  scrollToRegisterSection(): void {
    if (this.inDialog) {
      this.viewActionsService.scrollToIdInDialogComponent(
        'register-section',
        this.inDialog ? 'login-dialog' : null,
        'app-login-dialog'
      );
    } else {
      this.viewActionsService.scrollToIdInPage('register-section', this.shadowRootId);
    }
  }
}
