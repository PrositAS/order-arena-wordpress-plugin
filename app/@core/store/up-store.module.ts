import { NgModule } from '@angular/core';
import { Action, ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import { localStorageSync } from 'ngrx-store-localstorage';
import { CustomStorage } from '../Storage';
import { upReducer } from './reducers/up-reducer';

export function localStorageSyncReducer(reducer: ActionReducer<UPState>): ActionReducer<UPState> {
  return localStorageSync({
    keys: [
      'pluginSettings',
      'user',
      'articleGroups',
      'articles',
      'settings',
      'closedDates',
      'isPickup',
      'order',
      'orders',
      'orderArticles',
    ],
    storage: new CustomStorage('localStorage'),
    rehydrate: true,
  })(reducer);
}

const metaReducers: Array<MetaReducer<UPState, Action>> = [localStorageSyncReducer];

@NgModule({
  imports: [
    StoreModule.forRoot<UPState>(upReducer, { initialState: {}, metaReducers }),
    StoreDevtoolsModule.instrument({}),
  ],
})
export class UPStoreModule {}
