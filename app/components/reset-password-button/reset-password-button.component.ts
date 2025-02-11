import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ResetPasswordDialogComponent } from 'src/app/shadowed-components/reset-password-dialog/reset-password-dialog.component';

@Component({
  standalone: true,
  imports: [
    // Angular Material
    MatButtonModule,
    MatDialogModule,

    // Prosit
    CmTranslateModule,

    ResetPasswordDialogComponent,
  ],
  selector: 'app-reset-password-button',
  templateUrl: './reset-password-button.component.html',
  styleUrls: ['./reset-password-button.component.scss'],
})
export class ResetPasswordButtonComponent {
  @Input() email = null;
  @Input() color: ThemePalette = 'primary';
  @Input() disabled = false;

  constructor(private dialog: MatDialog) {}

  openResetPasswordDialog() {
    this.dialog.open(ResetPasswordDialogComponent, { data: { email: this.email } });
  }
}
