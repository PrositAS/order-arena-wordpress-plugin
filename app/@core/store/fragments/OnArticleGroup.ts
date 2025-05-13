import gql from 'graphql-tag';
import { OnArticle } from './OnArticle';

export const OnArticleGroup = {
  ArticleGroupDetails: gql`
    fragment ArticleGroupDetails on ArticleGroup {
      id
      name
      description
      position
      active
      activePeriodStart
      activePeriodEnd
      articleGroupId
      kind
      updatedAt
      articles {
        id
        position
        article {
          ...ArticleContent
        }
      }
    }
    ${OnArticle.ArticleContent}
  `,

  ArticleGroupInfo: gql`
    fragment ArticleGroupInfo on ArticleGroup {
      id
      name
      description
      position
      active
      articleGroupId
      kind
      updatedAt
    }
  `,
};
