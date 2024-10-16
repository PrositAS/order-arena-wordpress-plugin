import gql from 'graphql-tag';
import { OnArticle } from './OnArticle';

export const OnArticleGroup = {
  ArticleGroupContent: gql`
    fragment ArticleGroupContent on ArticleGroup {
      id
      name
      position
      active
      description
      activePeriodStart
      activePeriodEnd
    }
  `,

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
    }
  `,
};
