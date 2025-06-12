import gql from 'graphql-tag';

const CustomerAddress = gql`
  fragment CustomerAddressContent on CustomerAddress {
    id
    address1
    address2
    postcode
    city
    addressType
    firstName
    lastName
    companyName
    postcode
    phone
    email
    state
    country
  }
`;

export const OnCustomer = {
  CustomerContent: gql`
    fragment CustomerContent on Customer {
      id
      email
      phone
      firstName
      lastName
      active
      companies {
        id
        name
        orgNo
        addresses {
          id
          name
          address1
          address2
          addressType
          postcode
          city
          phone
          firstName
          lastName
        }
      }
      customerAddresses {
        ...CustomerAddressContent
      }
      orders {
        id
        orderSchedule {
          serveAt
          deliveryStart
          deliveryEnd
        }
        orderAddress {
          id
          address1
          city
          postcode
        }
        orderPrice {
          finalPrice
          discount
        }
      }
    }
    ${CustomerAddress}
  `,
  CustomerAddress: CustomerAddress,
};
