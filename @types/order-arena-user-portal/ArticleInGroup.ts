import { Article } from './Article';
import { ArticleGroup } from './ArticleGroup';
import { ID } from './ID';

export interface ArticleInGroup {
  id?: ID;
  article: Article;
  articleGroup: ArticleGroup;
  position?: number;
}
