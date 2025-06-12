import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CmTranslateModule } from '../../pipes/cm-translate/cm-translate.module';
import { ArticlesModule } from '../articles/articles.module';
import { ArticleGroupComponent } from './article-group/article-group.component';
@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatProgressSpinnerModule,

    // Prosit
    CmTranslateModule,

    ArticlesModule,
  ],
  declarations: [ArticleGroupComponent],
  exports: [ArticleGroupComponent],
})
export class ArticleGroupsModule {}
