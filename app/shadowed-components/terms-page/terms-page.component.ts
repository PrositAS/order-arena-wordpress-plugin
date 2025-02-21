import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { map, Observable, shareReplay, startWith } from 'rxjs';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { CmTranslateService } from 'src/app/services/cm-translate/cm-translate.service';
import { PluginSettingsService } from 'src/app/services/plugin-settings/plugin-settings.service';
import { OverlaySpinnerModule } from 'src/app/shared-components/overlay-spinner/overlay-spinner.module';
import { privacyPolicyUrl, termsOfUseUrl } from 'src/environments/plugin-config';
import { TermsComponent } from '../../components/terms/terms.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,

    // Prosit
    CmTranslateModule,

    OverlaySpinnerModule,
    TermsComponent,
  ],
  providers: [PluginSettingsService],
  selector: 'app-terms-page',
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class TermsPageComponent {
  // TODO: add component for header image
  imageHeaderUrl$: Observable<string>;
  hidden$: Observable<boolean>;

  termsOfUseUrl = termsOfUseUrl;
  privacyPolicyUrl = privacyPolicyUrl;

  constructor(
    private pluginSettingsService: PluginSettingsService,
    cmTranslateService: CmTranslateService
  ) {
    this.hidden$ = cmTranslateService.loaded$.pipe(
      startWith(false),
      map((loaded) => !loaded),
      shareReplay(1)
    );

    this.imageHeaderUrl$ = this.pluginSettingsService
      .getImageUrl('terms_and_conditions')
      .pipe(startWith(null), shareReplay(1));
  }
}
