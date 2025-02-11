import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_CARD_CONFIG, MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderArticlesServiceModule } from 'src/app/services/order-articles/order-articles-service.module';
import { EmptyPlaceholderComponent } from 'src/app/shared-components/empty-placeholder/empty-placeholder.component';
import { CmTranslateModule } from '../../pipes/cm-translate/cm-translate.module';
import { ArticleDetailsDialogComponent } from '../../shadowed-components/article-details-dialog/article-details-dialog.component';
import { ArticleComponent } from './article/article.component';
import { ArticlesComponent } from './articles/articles.component';
@NgModule({
  providers: [
    {
      provide: MAT_CARD_CONFIG,
      useValue: { appearance: 'outlined' },
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,

    // Prosit
    CmTranslateModule,
    OrderArticlesServiceModule,

    EmptyPlaceholderComponent,
    ArticleDetailsDialogComponent,
  ],
  declarations: [ArticlesComponent, ArticleComponent],
  exports: [ArticlesComponent],
})
export class ArticlesModule {}
