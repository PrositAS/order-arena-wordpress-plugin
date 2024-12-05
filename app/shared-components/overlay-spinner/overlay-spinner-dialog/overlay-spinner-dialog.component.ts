import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

export interface DialogData {
  mode: ProgressSpinnerMode;
}

@Component({
  selector: 'app-overlay-spinner-dialog',
  templateUrl: './overlay-spinner-dialog.component.html',
  styleUrls: ['./overlay-spinner-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlaySpinnerDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
