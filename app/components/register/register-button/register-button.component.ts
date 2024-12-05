import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { RegisterDialogComponent } from 'src/app/shadowed-components/register-dialog/register-dialog.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatButtonModule,
    MatDialogModule,

    // Prosit
    CmTranslateModule,

    RegisterDialogComponent,
  ],
  selector: 'app-register-button',
  templateUrl: './register-button.component.html',
  styleUrls: ['./register-button.component.scss'],
})
export class RegisterButtonComponent implements OnDestroy {
  @Input() color: ThemePalette = 'primary';
  @Input() linkMode = false;

  private destroy$ = new Subject<boolean>();

  constructor(private dialog: MatDialog) {}

  showRegisterForm() {
    this.dialog.open(RegisterDialogComponent, {
      height: '98vh',
      width: '98vw',
      maxWidth: '98vw',
      panelClass: 'register-dialog',
      disableClose: true,
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
