import { ArticleGroup } from 'src/@types/order-arena-user-portal/ArticleGroup';
import { ArticleGroupsAction } from '../actions/article-groups';

export const articleGroups = (state: ArticleGroup[] = [], action: ArticleGroupsAction): ArticleGroup[] => {
  switch (action.type) {
    case 'SET_ARTICLE_GROUPS':
      return [...action.payload.articleGroups];
    case 'RESET_ARTICLE_GROUPS':
      return null;
  }

  return state;
};
