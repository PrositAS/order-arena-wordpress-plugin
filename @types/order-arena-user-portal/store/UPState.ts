import { PluginSettings } from 'src/app/services/plugin-settings/plugin-settings.service';
import { ArticleGroup } from '../ArticleGroup';
import { ClosedDate } from '../ClosedDate';
import { Order as PastOrder } from '../Order';
import { Order } from '../order-form/Order';
import { PostOrderArticle } from '../params/PostOrder';
import { SaasSettings } from '../SaasSettings';
import { User } from '../User';

export interface UPState {
  pluginSettings: PluginSettings;
  user: User;
  articleGroups: ArticleGroup[];
  articles: ArticleGroup[];
  settings: SaasSettings;
  closedDates: ClosedDate[];
  isPickup: boolean;
  order: Order;
  orders: PastOrder[];
  orderArticles: PostOrderArticle[];
}
