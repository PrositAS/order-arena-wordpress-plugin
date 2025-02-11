import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DialogPosition, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { OverlaySpinnerDialogComponent } from '../overlay-spinner-dialog/overlay-spinner-dialog.component';

@Component({
  selector: 'app-overlay-spinner',
  templateUrl: './overlay-spinner.component.html',
  styleUrls: ['./overlay-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlaySpinnerComponent implements OnInit, OnDestroy {
  @Input() mode: ProgressSpinnerMode = 'indeterminate';
  @Input() triggerRef: HTMLElement = null;
  @Input() transparent = false;

  dialogRef: MatDialogRef<OverlaySpinnerDialogComponent>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    const dialogConfig: MatDialogConfig = {};
    if (this.triggerRef) {
      const rect: DOMRect = this.triggerRef.getBoundingClientRect();

      const position: DialogPosition = {};
      position.top = `${rect.top}px`;
      position.left = `${rect.left}px`;

      dialogConfig.width = `${rect.width}px`;
      dialogConfig.maxWidth = `${rect.width}px`;
      dialogConfig.height = `${rect.height}px`;
      dialogConfig.position = position;
    }
    this.dialogRef = this.dialog.open(OverlaySpinnerDialogComponent, {
      panelClass: 'transparent',
      backdropClass: this.transparent ? [] : ['spinner-backdrop'],
      disableClose: true,
      data: { mode: this.mode },
      ...dialogConfig,
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
