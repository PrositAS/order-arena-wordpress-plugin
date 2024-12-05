import { ID } from 'src/@types/order-arena-user-portal/ID';
import { PostOrderArticle } from 'src/@types/order-arena-user-portal/params/PostOrder';

export const orderArticles = (state: PostOrderArticle[] = [], { type, payload }): PostOrderArticle[] => {
  switch (type) {
    case 'SET_ORDER_ARTICLES':
      return payload;
    case 'ADD_ORDER_ARTICLE':
      return [...state, payload];

    case 'UPDATE_ORDER_ARTICLE_QUANTITY':
      return updateOrderArticleQuantity(payload.articleId, payload.quantity, state);

    case 'REMOVE_ORDER_ARTICLE':
      return removeOrderArticle(payload, state);

    case 'CLEAR_USER':
    case 'RESET_ORDER_ARTICLES':
    case 'COMPLETE_ORDER':
      return [];
  }

  return state;
};

function updateOrderArticleQuantity(articleId: ID, quantity: number, state: PostOrderArticle[]) {
  const i = getStateArticleIndex(articleId, state);

  if (i !== -1 && state[i].quantity !== quantity) {
    const newState = [...state];
    newState[i].quantity = quantity;

    newState[i].childArticles.map((ca) => (ca.quantity = quantity));

    return newState;
  }

  return state;
}

function removeOrderArticle(articleId: ID, state: PostOrderArticle[]) {
  const i = getStateArticleIndex(articleId, state);

  if (i !== -1) {
    return [...state.slice(0, i), ...state.slice(i + 1)];
  }

  return state;
}

function getStateArticleIndex(articleId: ID, state: PostOrderArticle[]) {
  return articleId ? state.findIndex((sa) => sa.articleId === articleId) : -1;
}
