import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PasswordUpdateAction } from 'src/@types/order-arena-user-portal/PasswordUpdate';
import { PasswordFormComponent } from 'src/app/components/password/password-form/password-form.component';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';

export interface DialogData {
  token: string;
}

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

    PasswordFormComponent,
  ],
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class PasswordDialogComponent {
  action: PasswordUpdateAction = 'set';
  token = this.data?.token ?? null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<PasswordDialogComponent>
  ) {}

  close(close: boolean) {
    if (close) {
      this.dialogRef.close();
      window.history.replaceState(null, '', window.location.pathname);
    }
  }
}
