import { CommonModule } from '@angular/common';
import { ApplicationRef, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { CoreModule } from '../@core/core.module';
import { LoginButtonComponent } from '../components/login/login-button/login-button.component';
import { LoginComponent } from '../components/login/login/login.component';
import { OrderArticlesCountComponent } from '../components/order-articles-count/order-articles-count.component';
import { TermsComponent } from '../components/terms/terms.component';
import { PluginSettingsService } from '../services/plugin-settings/plugin-settings.service';
import { CheckoutPageComponent } from '../shadowed-components/checkout-page/checkout-page.component';
import { MenuPageComponent } from '../shadowed-components/menu-page/menu-page.component';
import { ProfileComponent } from '../shadowed-components/profile/profile.component';
import { TermsPageComponent } from '../shadowed-components/terms-page/terms-page.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Prosit
    CoreModule,

    // Prosit web components
    LoginButtonComponent,
    LoginComponent,
    ProfileComponent,
    MenuPageComponent,
    OrderArticlesCountComponent,
    CheckoutPageComponent,
    TermsComponent,
    TermsPageComponent,
  ],
  providers: [PluginSettingsService],
})
export class AppModule {
  appRef: ApplicationRef;

  constructor(
    private pluginSettingsService: PluginSettingsService,
    private injector: Injector
  ) {
    this.pluginSettingsService.updateStylesPluginSettings();
  }

  ngDoBootstrap() {
    const profilePage = createCustomElement(ProfileComponent, { injector: this.injector });
    customElements.define('up-profile-page', profilePage);

    const menuPage = createCustomElement(MenuPageComponent, { injector: this.injector });
    customElements.define('up-menu-page', menuPage);

    const checkoutPage = createCustomElement(CheckoutPageComponent, { injector: this.injector });
    customElements.define('up-checkout-page', checkoutPage);

    const termsPage = createCustomElement(TermsPageComponent, { injector: this.injector });
    customElements.define('up-terms-page', termsPage);
  }
}
