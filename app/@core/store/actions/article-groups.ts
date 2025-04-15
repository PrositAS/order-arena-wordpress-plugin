import gql from 'graphql-tag';
import { ArticleGroup } from 'src/@types/order-arena-user-portal/ArticleGroup';
import { OnArticleGroup } from '../fragments/OnArticleGroup';

export type ArticleGroupsAction = {
  type: string;
  payload?: {
    articleGroups: ArticleGroup[];
  };
};

export function setArticleGroupsAction(articleGroups: ArticleGroup[]): ArticleGroupsAction {
  return {
    type: 'SET_ARTICLE_GROUPS',
    payload: { articleGroups },
  };
}

export function resetArticleGroupsAction(): ArticleGroupsAction {
  return {
    type: 'RESET_ARTICLE_GROUPS',
  };
}

export const articleGroupQuery = gql`
  query articleGroup($id: ID!) {
    articleGroups(id: $id) {
      collection {
        ...ArticleGroupDetails
      }
    }
  }
  ${OnArticleGroup.ArticleGroupDetails}
`;

export const articleGroupInfoQuery = gql`
  query articleGroup($id: ID!) {
    articleGroups(id: $id) {
      collection {
        ...ArticleGroupInfo
      }
    }
  }
  ${OnArticleGroup.ArticleGroupInfo}
`;

export const articleGroupsQuery = gql`
  query {
    articleGroups {
      collection {
        ...ArticleGroupDetails
      }
    }
  }
  ${OnArticleGroup.ArticleGroupDetails}
`;

export const articleGroupsInfoQuery = gql`
  query {
    articleGroups {
      collection {
        ...ArticleGroupInfo
      }
    }
  }
  ${OnArticleGroup.ArticleGroupInfo}
`;
