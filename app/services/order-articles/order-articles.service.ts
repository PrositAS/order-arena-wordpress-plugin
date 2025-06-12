import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { Article } from 'src/@types/order-arena-user-portal/Article';
import { MappedPostOrderArticle } from 'src/@types/order-arena-user-portal/forms/MappedOrder';
import { ID } from 'src/@types/order-arena-user-portal/ID';
import { OrderArticle } from 'src/@types/order-arena-user-portal/OrderArticle';
import { PostOrderArticle } from 'src/@types/order-arena-user-portal/params/PostOrder';
import { QuantityType } from 'src/@types/order-arena-user-portal/QuantityType';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import {
  addOrderArticleAction,
  removeOrderArticleAction,
  resetOrderArticlesAction,
  setOrderArticlesAction,
  updateOrderArticleQuantityAction,
} from 'src/app/@core/store/actions/order-articles';
import { isNullOrUndefined } from 'src/app/@core/utils';

@Injectable()
export class OrderArticlesService {
  constructor(private ngrx: Store<UPState>) {}

  get orderArticles(): Observable<PostOrderArticle[]> {
    return this.ngrx.pipe(select((store) => store.orderArticles));
  }

  getMappedArticles(): Observable<MappedPostOrderArticle[]> {
    return this.orderArticles.pipe(
      map((orderArticles) =>
        (orderArticles || []).map<MappedPostOrderArticle>((article: PostOrderArticle) => ({
          ...article,
          _basic: article.childArticles
            .filter((child) => !child.isExtra)
            .map((child) => child.name)
            .join(', '),
          _extra: article.childArticles.filter((child) => child.isExtra),
        }))
      )
    );
  }

  getOrderArticleById(id: ID): Observable<PostOrderArticle> {
    return this.orderArticles.pipe(map((articles) => articles.find((article) => article.articleId === id)));
  }

  setOrderArticles(articles: PostOrderArticle[]) {
    this.ngrx.dispatch(setOrderArticlesAction(articles));
  }

  addOrderArticle(article: Article, quantity: number = null) {
    this.ngrx.dispatch(addOrderArticleAction(this.mapArticleToPostOrderArticle(article, quantity)));
  }

  updateOrderArticleQuantity(articleId: ID, quantity: number) {
    this.ngrx.dispatch(updateOrderArticleQuantityAction(articleId, quantity));
  }

  removeOrderArticle(articleId: ID) {
    this.ngrx.dispatch(removeOrderArticleAction(articleId));
  }

  resetOrderArticles() {
    this.ngrx.dispatch(resetOrderArticlesAction());
  }

  mapOrderArticleToPostOrderArticle(article: OrderArticle, quantity: number = null): PostOrderArticle {
    const articleQuantity = quantity ? quantity : article.quantity;

    return {
      articleId: article.id as ID,
      position: article.position || 0,
      quantity: articleQuantity,
      minPersons: article.article.minPersons,
      baseQuantity: article.article.quantityPerPerson as number,
      quantityName: (
        (article.article.food || article.article.equipment || article.article.venue)
          .quantityType as QuantityType
      ).name,
      price: article.articlePrice,
      name: ((article.article.food || article.article.equipment || article.article.venue) as { name: string })
        .name,
      description: (
        (article.article.food || article.article.equipment || article.article.venue) as {
          description: string;
        }
      ).description,
      isFood: !isNullOrUndefined(article.article.food),
      isEquipment: !isNullOrUndefined(article.article.equipment),
      isVenue: !isNullOrUndefined(article.article.venue),
      image: (article.article.images || [])[0],
      vatRate: article.article.vatRate,
      childArticles: article.childArticles.map((child, i) => {
        return {
          articleId: child.id as ID,
          name: ((child.article.food || child.article.equipment || child.article.venue) as { name: string })
            .name,
          position: i,
          price: child.article.price || 0,
          quantity: articleQuantity,
          baseQuantity: child.article.quantityPerPerson as number,
          quantityName: (
            (child.article.food || child.article.equipment || child.article.venue)
              .quantityType as QuantityType
          ).name,
          isFood: !isNullOrUndefined(child.article.food),
          isEquipment: !isNullOrUndefined(child.article.equipment),
          isVenue: !isNullOrUndefined(child.article.venue),
          isExtra: child.extraArticle,
          vatRate: child.article.vatRate,
        };
      }),
    };
  }

  mapArticleToPostOrderArticle(article: Article, quantity: number = null): PostOrderArticle {
    const articleQuantity = quantity ? quantity : article.minPersons;

    return {
      articleId: article.id as ID,
      position: 0,
      quantity: articleQuantity,
      minPersons: article.minPersons,
      baseQuantity: article.quantityPerPerson as number,
      quantityName: !article.venue
        ? ((article.food || article.equipment) as { quantityType: QuantityType }).quantityType.name
        : '',
      price: article.price,
      priceMva: article.priceMva,
      name: ((article.food || article.equipment || article.venue) as { name: string }).name,
      description: ((article.food || article.equipment || article.venue) as { description: string })
        .description,
      isFood: !isNullOrUndefined(article.food),
      isEquipment: !isNullOrUndefined(article.equipment),
      isVenue: !isNullOrUndefined(article.venue),
      image: (article.images || [])[0],
      vatRate: article.vatRate,
      childArticles: ((article.childArticles as Article[]) || []).map((child, i) => {
        return {
          articleId: child.id as ID,
          name: ((child.food || child.equipment || child.venue) as { name: string }).name,
          position: i,
          price: child.price || 0,
          quantity: articleQuantity,
          baseQuantity: child.quantityPerPerson as number,
          quantityName: !child.venue
            ? ((child.food || child.equipment) as { quantityType: QuantityType }).quantityType.name
            : '',
          isFood: !isNullOrUndefined(child.food),
          isEquipment: !isNullOrUndefined(child.equipment),
          isVenue: !isNullOrUndefined(child.venue),
          isExtra: child.extraArticle,
          vatRate: child.vatRate,
        };
      }),
    };
  }
}
