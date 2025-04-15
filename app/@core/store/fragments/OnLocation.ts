import gql from 'graphql-tag';

export const OnLocation = {
  LocationContent: gql`
    fragment LocationContent on SaasLocation {
      address1
      address2
      city
      country
      id
      name
      postcode
      state
    }
  `,
};
