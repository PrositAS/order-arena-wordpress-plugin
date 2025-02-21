import gql from 'graphql-tag';

export const OnEquipment = {
  EquipmentContent: gql`
    fragment EquipmentContent on Equipment {
      id
      name
      description
      active
      hasArticle
      quantityType {
        id
        name
      }
    }
  `,
};
