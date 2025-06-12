import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlaySpinnerDialogComponent } from './overlay-spinner-dialog/overlay-spinner-dialog.component';
import { OverlaySpinnerComponent } from './overlay-spinner/overlay-spinner.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  declarations: [OverlaySpinnerComponent, OverlaySpinnerDialogComponent],
  exports: [OverlaySpinnerComponent],
})
export class OverlaySpinnerModule {}
