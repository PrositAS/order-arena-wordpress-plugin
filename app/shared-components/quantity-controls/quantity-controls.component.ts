import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { map, tap } from 'rxjs';
import { PostOrderArticle } from 'src/@types/order-arena-user-portal/params/PostOrder';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { OrderArticlesServiceModule } from 'src/app/services/order-articles/order-articles-service.module';
import { OrderArticlesService } from 'src/app/services/order-articles/order-articles.service';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatIconModule,
    MatButtonModule,

    // Prosit
    CmTranslateModule,
    OrderArticlesServiceModule,
  ],
  selector: 'app-quantity-controls',
  templateUrl: './quantity-controls.component.html',
  styleUrls: ['./quantity-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantityControlsComponent implements OnInit {
  @Input() article: PostOrderArticle = null;
  @Input() color: ThemePalette = 'primary';
  @Input() syncWithStore = false;
  @Input() quantityWarning = true;
  @Output() articleQuantityChanges = new EventEmitter<number>();

  quantity: FormControl<number>;
  minQuantity: number;

  destroyRef = inject(DestroyRef);

  constructor(private orderArticlesService: OrderArticlesService) {}

  ngOnInit(): void {
    if (this.article) {
      this.minQuantity = this.article.minPersons || this.article.baseQuantity;
      this.quantity = new FormControl<number>(this.article.quantity, {
        validators: [Validators.required, Validators.min(this.minQuantity)],
        updateOn: 'blur',
      });

      this.quantity.valueChanges
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          map((quantity) => {
            if (quantity < this.minQuantity) {
              this.quantity.setValue(this.minQuantity);

              return this.minQuantity;
            }

            return quantity;
          }),
          tap((quantity) => {
            this.articleQuantityChanges.emit(quantity);

            if (this.syncWithStore) {
              this.updateArticleQuantity(quantity);
            }
          })
        )
        .subscribe();
    }
  }

  updateArticleQuantity(quantity: number) {
    this.orderArticlesService.updateOrderArticleQuantity(this.article.articleId, quantity);
  }

  add() {
    this.quantity.setValue(this.quantity.value + 1);
  }

  subtract() {
    this.quantity.setValue(this.quantity.value - 1);
  }
}
