import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { select, Store } from '@ngrx/store';
import { OAuthService, TokenResponse } from 'angular-oauth2-oidc';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, defer, from, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { PasswordUpdate } from 'src/@types/order-arena-user-portal/PasswordUpdate';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import { User, UserAuth } from 'src/@types/order-arena-user-portal/User';
import { UserCredentials } from 'src/@types/order-arena-user-portal/UserCredentials';
import { UserRegisterCredentials } from 'src/@types/order-arena-user-portal/UserRegisterCredentials';
import { TranslatedSnackBarService } from '../services/translated-snack-bar/translated-snack-bar.service';
import { OAuthConfig } from './apiConfig';
import { BroadcasterService, EVENTS } from './broadcaster.service';
import {
  clearUserAction,
  currentUserQuery,
  registerUserQuery,
  setPasswordQuery,
  setUserAction,
} from './store/actions/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private ngrx: Store<UPState>,
    private auth: OAuthService,
    private bs: BroadcasterService,
    private http: Apollo,
    private translatedSnackBarService: TranslatedSnackBarService
  ) {
    this.auth.configure(OAuthConfig);
    this.loggedIn$.next(this.auth.hasValidAccessToken());

    if (this.auth.getAccessToken()) {
      if (!this.auth.hasValidAccessToken()) {
        this.logout();
      } else {
        this.getUserInfo();
      }
    }

    this.bs.on(EVENTS.LOGIN).subscribe((v) => this.loggedIn$.next(v));
  }

  private loggedIn$ = new BehaviorSubject(false);

  // subject on subscription solves issue of switchMap to promise, which does not return result
  register(user: UserRegisterCredentials): Observable<boolean> {
    const s = new Subject<boolean>();
    this.http
      .mutate<{ registerUser: User }>({ mutation: registerUserQuery(user), variables: { ...user } })
      .subscribe(
        (response: ApolloQueryResult<{ registerUser: User }>) => {
          if (!response.data.registerUser) {
            s.error(response.errors && response.errors[0] && response.errors[0].message);
            return;
          }
          this.auth
            .fetchTokenUsingPasswordFlow(user.email, user.password)
            .then((r) => {
              this.getUserInfo();
              const validToken = this.auth.hasValidAccessToken();
              this.bs.emit(EVENTS.LOGIN, () => validToken);
              s.next(validToken);
              s.complete();
            })
            .catch((e) => {
              this.logout();
              s.next(false);
            });
        },
        () => {
          this.logout();
          s.next(false);
        }
      );
    return s.asObservable();
  }

  login(user: UserCredentials): Observable<string | null> {
    return defer(() => from(this.auth.fetchTokenUsingPasswordFlow(user.username, user.password))).pipe(
      switchMap((res: TokenResponse & UserAuth) => {
        if (!res) {
          throw new Error('INVALID_CREDENTIALS');
        }

        return res && this.hasRole(res, 'customer') && this.auth.hasValidAccessToken()
          ? this.queryUserInfo()
          : of(null);
      }),
      map((u: User) => {
        if (!u || !u.customer?.active) {
          throw new Error('INACTIVE_CUSTOMER');
        }

        this.bs.emit(EVENTS.LOGIN, () => true);

        return null;
      }),
      catchError((e) => {
        this.logout();

        const error = e.error?.error ?? e.message ?? e;

        return error ? of(error.toUpperCase()) : of('UKNOWN_ERROR');
      }),
      take(1)
    );
  }

  get user(): Observable<User> {
    return this.ngrx.pipe(select((store) => store.user));
  }

  get displayUser(): Observable<string> {
    return this.user.pipe(
      map((user) =>
        user ? (user.name && user.surname ? `${user.name} ${user.surname}` : user.email || '') : ''
      )
    );
  }

  resetPassword(email: string) {
    return this.http
      .mutate<{ forgotPasswordUser: string }>({
        mutation: gql`
          mutation forgotPasswordUser($email: String!) {
            forgotPasswordUser(email: $email) {
              email
            }
          }
        `,
        variables: { email },
      })
      .pipe(map((response) => response.data.forgotPasswordUser));
  }

  setPassword(passwordUpdate: PasswordUpdate) {
    return this.http
      .mutate({
        mutation: setPasswordQuery(passwordUpdate.password, passwordUpdate.token),
        variables: { password: passwordUpdate.password, token: passwordUpdate.token },
      })
      .pipe(
        map((result: ApolloQueryResult<{ setPassword: User }>) => {
          if (result.errors || result.error) {
            throw new Error('SET_PASSWORD_FAILED');
          }

          if (result.data.setPassword === null) {
            throw new Error('SET_PASSWORD_TOKEN_EXPIRED');
          }

          return result.data.setPassword;
        }),
        catchError((e) => {
          this.translatedSnackBarService.open(e.message, 'OK');

          return of(null);
        }),
        switchMap((user) => {
          if (!user) {
            return of(null);
          }

          this.translatedSnackBarService.open('SET_PASSWORD_SUCCESS', 'OK');

          const credentials: UserCredentials = {
            username: user.email,
            password: passwordUpdate.password,
          };
          return this.login(credentials);
        })
      );
  }

  logout() {
    this.auth.logOut();
    this.bs.emit(EVENTS.LOGIN, false);
    this.user.pipe(take(1)).subscribe(() => {
      this.ngrx.dispatch(clearUserAction());
    });
  }

  get loggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  hasRole(user: TokenResponse & UserAuth, role: string): boolean {
    return user.user_roles.includes(role);
  }

  private getUserInfo() {
    this.http.query({ query: currentUserQuery }).subscribe((results: ApolloQueryResult<{ user: User }>) => {
      this.setStoreUser(results.data.user);
    });
  }

  private setStoreUser(user: User) {
    this.ngrx.dispatch(setUserAction(user));
  }

  private queryUserInfo() {
    return this.http.query({ query: currentUserQuery }).pipe(
      map((result: ApolloQueryResult<{ user: User }>) =>
        !result.errors || !result.errors?.length ? result.data.user : null
      ),
      filter((user: User) => !!user),
      tap((user: User) => this.setStoreUser(user))
    );
  }
}
