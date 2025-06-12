import gql from 'graphql-tag';

export const OnOrderRequest = {
  OrderRequestListElement: gql`
    fragment OrderRequestListElement on OrderRequest {
      id
      status
      customer {
        email
        id
      }
      orderSchedule {
        serveAt
      }
    }
  `,
  OrderRequestDetails: gql`
    fragment OrderRequestDetails on OrderRequest {
      id
      invoice {
        id
        invoiceType
        firstName
        lastName
        email
        phone
        address1
        address2
        postcode
        city
        company
        orgNo
      }
      orderAddress {
        id
        address1
        address2
        city
        postcode
        addressType
      }
      orderArticles {
        id
        totalPrice
        article {
          id
          price
          quantityPerPerson
          vatRate {
            id
            value
          }
          food {
            id
            name
            quantityType {
              id
              name
            }
          }
          equipment {
            id
            name
            quantityType {
              id
              name
            }
          }
          venue {
            id
            name
            quantityType {
              id
              name
            }
          }
        }
        quantity
        childArticles {
          id
          quantity
          extraArticle
          article {
            id
            price
            quantityPerPerson
            vatRate {
              id
              value
            }
            equipment {
              id
              name
              quantityType {
                id
                name
              }
            }
            food {
              id
              name
              quantityType {
                id
                name
              }
            }
            venue {
              id
              name
              quantityType {
                id
                name
              }
            }
          }
        }
      }
      orderEquipment {
        deliveryAction
        daysBefore
        deliveryAddress {
          id
        }
        deliveryStart
        deliveryEnd
        pickupAction
        pickupDaysAfter
        pickupAddress {
          id
        }
        pickupStart
        pickupEnd
      }
      orderNote {
        delivery
        orderNote
      }
      orderPrice {
        discount
        totalPrice
        finalPrice
        mvaRate
        finalPriceMva
      }
      orderSchedule {
        deliverMinutesBefore
        drivingMinutesTime
        kitchenReadyAt
        deliveryEnd
        deliveryStart
        serveAt
        pickup
      }
      status
    }
  `,
};
