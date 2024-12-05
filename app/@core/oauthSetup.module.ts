/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { NgModule } from '@angular/core';

import { OAuthModule, UrlHelperService } from 'angular-oauth2-oidc';

@NgModule({
  imports: [OAuthModule.forRoot()],
  providers: [UrlHelperService],
})
export class OAuthSetupModule {}
