import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from 'src/app/components/login/login/login.component';
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

    LoginComponent,
  ],
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class LoginDialogComponent {
  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) {}

  scrolledToBottom: boolean = false;

  close(validated: boolean) {
    if (validated) {
      this.dialogRef.close();
    }
  }

  scrolled(event: Event) {
    const target = event.target as HTMLDivElement;
    if (target) {
      this.scrolledToBottom = target.scrollTop >= target.scrollHeight - target.clientHeight;
    }
  }
}
