import { ActionReducerMap } from '@ngrx/store';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import { articleGroups } from './article-groups';
import { articles } from './articles';
import { closedDates } from './closed-dates';
import { isPickup } from './is-pickup';
import { order } from './order';
import { orderArticles } from './order-articles';
import { orders } from './orders';
import { pluginSettings } from './plugin-settings';
import { settings } from './settings';
import { user } from './user';

export const upReducer: ActionReducerMap<UPState> = {
  pluginSettings,
  user,
  articleGroups,
  articles,
  settings,
  closedDates,
  isPickup,
  order,
  orders,
  orderArticles,
};
