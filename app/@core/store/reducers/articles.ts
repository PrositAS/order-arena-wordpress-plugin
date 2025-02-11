import { ArticleGroup } from 'src/@types/order-arena-user-portal/ArticleGroup';
import { ArticleInGroup } from 'src/@types/order-arena-user-portal/ArticleInGroup';
import { ID } from 'src/@types/order-arena-user-portal/ID';
import { ArticlesAction } from '../actions/articles';

export const articles = (state: ArticleGroup[] = [], action: ArticlesAction): ArticleGroup[] => {
  switch (action.type) {
    case 'SET_ARTICLES_GROUPS':
      return [...action.payload.articleGroups];
    case 'UPDATE_ARTICLES_GROUP':
      return updateArticlesGroup(action.payload.articleGroup, state);
    case 'UPDATE_ARTICLES_GROUPS':
      return updateArticlesGroups(action.payload.articleGroups, state);
    case 'RESET_ARTICLE_GROUPS':
    case 'RESET_ARTICLES':
      return null;
    case 'SET_GROUP_ARTICLES':
      return setGroupArticles(
        action.payload.articleGroup,
        action.payload.groupId,
        action.payload.articles,
        state
      );
    case 'RESET_GROUP_ARTICLES':
      return resetGroupArticles(action.payload.articleGroup, action.payload.groupId, state);
  }

  return state;
};

function updateArticlesGroups(articleGroups: ArticleGroup[] = [], state: ArticleGroup[]): ArticleGroup[] {
  return articleGroups.reduce(
    (newState, articleGroup) => updateArticlesGroup(articleGroup, newState),
    [...state]
  );
}

function updateArticlesGroup(articleGroup: ArticleGroup = null, state: ArticleGroup[]): ArticleGroup[] {
  if (articleGroup) {
    const i = getStateArticleGroupIndex(articleGroup, null, state);

    if (i !== -1) {
      return [...state.slice(0, i), articleGroup, ...state.slice(i + 1)];
    } else {
      return [...state, articleGroup];
    }
  }

  return state;
}

function setGroupArticles(
  articleGroup: ArticleGroup = null,
  groupId: ID = null,
  articles: ArticleInGroup[],
  state: ArticleGroup[]
) {
  const i = getStateArticleGroupIndex(articleGroup, groupId, state);

  if (i !== -1 && state[i].articles !== articles) {
    const newState = JSON.parse(JSON.stringify(state)) as ArticleGroup[];
    newState[i].articles = articles;

    return newState;
  }

  return state;
}

function resetGroupArticles(articleGroup: ArticleGroup = null, groupId: ID = null, state: ArticleGroup[]) {
  return setGroupArticles(articleGroup, groupId, null, state);
}

function getStateArticleGroupIndex(
  articleGroup: ArticleGroup = null,
  groupId: ID = null,
  state: ArticleGroup[]
) {
  const id: ID = articleGroup?.id ?? groupId ?? null;
  return id ? state.findIndex((ag) => ag.id === id) : -1;
}
