import { ID } from 'src/@types/order-arena-user-portal/ID';
import { PostOrderArticle } from 'src/@types/order-arena-user-portal/params/PostOrder';

export function setOrderArticlesAction(articles: PostOrderArticle[]) {
  return {
    type: 'SET_ORDER_ARTICLES',
    payload: articles,
  };
}

export function addOrderArticleAction(article: PostOrderArticle) {
  return {
    type: 'ADD_ORDER_ARTICLE',
    payload: article,
  };
}

export function updateOrderArticleQuantityAction(articleId: ID, quantity: number) {
  return {
    type: 'UPDATE_ORDER_ARTICLE_QUANTITY',
    payload: { articleId, quantity },
  };
}

export function removeOrderArticleAction(articleId: ID) {
  return {
    type: 'REMOVE_ORDER_ARTICLE',
    payload: articleId,
  };
}

export function resetOrderArticlesAction() {
  return {
    type: 'RESET_ORDER_ARTICLES',
  };
}
