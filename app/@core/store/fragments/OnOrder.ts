import gql from 'graphql-tag';

export const OnOrder = {
  OrderContent: gql`
    fragment OrderContent on Order {
      id
      customer {
        firstName
        lastName
        id
      }
      orderSchedule {
        serveAt
        deliveryStart
        deliveryEnd
      }
      orderPeople {
        numberOfPersons
      }
      orderArticles {
        id
        quantity
        articlePrice
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
        childArticles {
          id
          quantity
          extraArticle
          quantityType {
            id
            name
          }
          article {
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
          }
        }
      }
      orderNote {
        delivery
        external
        internal
      }
      orderPrice {
        finalPrice
      }
    }
  `,

  OrderDetails: gql`
    fragment OrderDetails on Order {
      id
      status
      customer {
        firstName
        lastName
        email
        phone
        id
      }
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
      orderSchedule {
        deliverMinutesBefore
        drivingMinutesTime
        kitchenReadyAt
        deliveryEnd
        deliveryStart
        serveAt
        pickup
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
      orderPeople {
        numberOfPersons
        chefs
        waiters
      }
      orderNote {
        delivery
        external
        orderNote
      }
      orderPrice {
        discount
        totalPrice
        finalPrice
        mvaRate
        finalPriceMva
      }
      actionsCompleted {
        name
        details
        changedAt
      }
      actionsNext {
        name
        required
      }
      orderLogAlerts {
        name
        details
        createdAt
        updatedAt
      }
      orderArticles {
        id
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
        totalPrice
        totalPriceMva
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
    }
  `,
};
