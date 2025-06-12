import gql from 'graphql-tag';
import { OnEquipment } from './OnEquipment';
import { OnFood } from './OnFood';

const VenueContent = gql`
  fragment VenueContent on Venue {
    id
    name
    description
    active
  }
`;

export const OnArticle = {
  ArticleContent: gql`
    fragment ArticleContent on Article {
      id
      price
      priceMva
      quantityPerPerson
      kind
      minPersons
      activeWeb
      activePeriodEnd
      activePeriodStart
      vatRate {
        id
        value
      }
      images {
        id
        url
      }
      childArticles {
        id
        activeWeb
        vatRate {
          id
          value
        }
        food {
          ...FoodContent
        }
        equipment {
          ...EquipmentContent
        }
        venue {
          ...VenueContent
        }
      }
      food {
        ...FoodContent
      }
      venue {
        ...VenueContent
      }
      equipment {
        ...EquipmentContent
      }
    }
    ${VenueContent}
    ${OnEquipment.EquipmentContent}
    ${OnFood.FoodContent}
  `,

  ArticleEquipmentContent: gql`
    fragment ArticleEquipmentContent on Article {
      id
      price
      quantityPerPerson
      kind
      minPersons
      activeWeb
      activePeriodEnd
      activePeriodStart
      articleGroups {
        id
        name
      }
      equipment {
        ...EquipmentContent
      }
    }
    ${OnEquipment.EquipmentContent}
  `,

  ArticleVenueContent: gql`
    fragment ArticleVenueContent on Article {
      id
      price
      quantityPerPerson
      kind
      minPersons
      activeWeb
      activePeriodEnd
      activePeriodStart
      articleGroups {
        id
        name
      }
      venue {
        ...VenueContent
      }
    }
    ${VenueContent}
  `,
};
