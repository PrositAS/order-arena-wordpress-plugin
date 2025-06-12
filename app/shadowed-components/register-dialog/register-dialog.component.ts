import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RegisterFormComponent } from 'src/app/components/register/register-form/register-form.component';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';

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

    RegisterFormComponent,
  ],
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class RegisterDialogComponent {
  constructor(public dialogRef: MatDialogRef<RegisterDialogComponent>) {}

  close(registered: boolean) {
    if (registered) {
      this.dialogRef.close();
    }
  }
}
