import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { camelToSnakeCase } from 'src/app/@core/utils';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,

    // Prosit
    CmTranslateModule,
  ],
  selector: 'app-form-actions',
  templateUrl: './form-actions.component.html',
  styleUrls: ['./form-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormActionsComponent {
  @Input() formName: string = null;
  @Input() saveDisabled = true;
  @Input() resetDisabled = false;
  @Output() saveForm = new EventEmitter();
  @Output() resetForm = new EventEmitter();

  get formNameKey() {
    return camelToSnakeCase(this.formName).toUpperCase() + '_FORM';
  }

  save() {
    this.saveForm.emit();
  }

  reset() {
    this.resetForm.emit();
  }
}
