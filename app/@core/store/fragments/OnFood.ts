import gql from 'graphql-tag';

export const OnFood = {
  FoodRelation: gql`
    fragment FoodRelationContent on FoodRelation {
      childFood {
        id
      }
      id
      parentFood {
        id
      }
      quantityPerPortion
    }
  `,

  FoodContent: gql`
    fragment FoodContent on Food {
      id
      name
      description
      active
      baseQuantity
      hasArticle
      pricePerUnit
      allergens {
        id
        name
      }
      quantityType {
        id
        name
      }
    }
  `,
};
