/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { OAuthService } from 'angular-oauth2-oidc';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { environment } from '../../environments/environment';

@NgModule({
  imports: [HttpClientModule, ApolloModule],
})
export class ApolloApiModule {
  constructor(http: HttpClient, oauthService: OAuthService, apollo: Apollo, httpLinkService: HttpLink) {
    const url = environment.graphQL;

    const httpLink = httpLinkService.create({ uri: url });

    const authHttpLink = setContext((_, context: { isPublic: boolean, headers: any }) => {
      const token = oauthService.getAccessToken();
      const extraHeaders: any = {};
      if (!token || context.isPublic) {
        extraHeaders['Graphql-Public-request'] = 'true';
      }
      if (token && !context.isPublic) {
        extraHeaders.authorization = `Bearer ${token}`;
      }

      return {
        headers: {
          ...context.headers,
          ...extraHeaders,
        },
      };
    });

    const cache = new InMemoryCache();

    const defaultOptions: DefaultOptions = {
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    };

    const link = authHttpLink.concat(httpLink);

    apollo.create({
      link,
      cache,
      defaultOptions,
    });
  }
}
