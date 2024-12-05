import gql from 'graphql-tag';
import { ArticleGroup } from 'src/@types/order-arena-user-portal/ArticleGroup';
import { ArticleInGroup } from 'src/@types/order-arena-user-portal/ArticleInGroup';
import { ID } from 'src/@types/order-arena-user-portal/ID';

export type ArticlesAction = {
  type: string;
  payload?: {
    articleGroups?: ArticleGroup[];
    articleGroup?: ArticleGroup;
    groupId?: ID;
    articles?: ArticleInGroup[];
  };
};

export function updateArticlesGroupAction(articleGroup: ArticleGroup) {
  return {
    type: 'UPDATE_ARTICLES_GROUP',
    payload: { articleGroup },
  };
}

export function updateArticlesGroupsAction(articleGroups: ArticleGroup[]) {
  return {
    type: 'UPDATE_ARTICLES_GROUPS',
    payload: { articleGroups },
  };
}

export function setArticlesGroupsAction(articleGroups: ArticleGroup[]): ArticlesAction {
  return {
    type: 'SET_ARTICLES_GROUPS',
    payload: {
      articleGroups,
    },
  };
}

export function resetArticlesAction(): ArticlesAction {
  return {
    type: 'RESET_ARTICLES',
  };
}

export function setGroupArticlesAction(
  articleGroup: ArticleGroup = null,
  groupId: ID = null,
  articles: ArticleInGroup[]
): ArticlesAction {
  return {
    type: 'SET_GROUP_ARTICLES',
    payload: {
      articleGroup,
      groupId,
      articles,
    },
  };
}

export function resetGroupArticlesAction(
  articleGroup: ArticleGroup = null,
  groupId: ID = null
): ArticlesAction {
  return {
    type: 'RESET_GROUP_ARTICLES',
    payload: {
      articleGroup,
      groupId,
    },
  };
}

export const articleQuery = gql`
  query article($id: ID) {
    articles(id: $id) {
      collection {
        id
        minPersons
        quantityPerPerson
        price
        priceMva
        articleGroups {
          id
        }
        vatRate {
          id
          value
        }
        images {
          id
          url
        }
        food {
          id
          name
          description
          quantityType {
            id
            name
          }
          allergens {
            id
            name
          }
          childFoodRelations {
            id
            position
            childFood {
              id
              name
            }
          }
        }
        equipment {
          id
          name
          description
          quantityType {
            id
            name
          }
        }
        venue {
          id
          name
          description
        }
        childArticles {
          id
          price
          quantityPerPerson
          activeWeb
          vatRate {
            id
            value
          }
          food {
            id
            name
            description
            quantityType {
              id
              name
            }
            allergens {
              id
              name
            }
          }
          equipment {
            id
            name
            description
            quantityType {
              id
              name
            }
          }
          venue {
            id
            name
            description
          }
        }
      }
    }
  }
`;

export const groupArticlesQuery = gql`
  query articleGroups($id: ID) {
    articleGroups(id: $id) {
      collection {
        articles {
          id
          position
          article {
            id
            minPersons
            quantityPerPerson
            price
            priceMva
            articleGroups {
              id
            }
            vatRate {
              id
              value
            }
            images {
              id
              url
            }
            food {
              id
              name
              description
              quantityType {
                id
                name
              }
              allergens {
                id
                name
              }
              childFoodRelations {
                id
                position
                childFood {
                  id
                  name
                }
              }
            }
            equipment {
              id
              name
              description
              quantityType {
                id
                name
              }
            }
            venue {
              id
              name
              description
            }
            childArticles {
              id
              price
              quantityPerPerson
              activeWeb
              vatRate {
                id
                value
              }
              food {
                id
                name
                description
                quantityType {
                  id
                  name
                }
                allergens {
                  id
                  name
                }
              }
              equipment {
                id
                name
                description
                quantityType {
                  id
                  name
                }
              }
              venue {
                id
                name
                description
              }
            }
          }
        }
      }
    }
  }
`;
