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
      status
      customer {
        firstName
        lastName
        email
        id
      }
      orderAddress {
        id
        city
        address1
        address2
        postcode
        firstName
        lastName
        phone
        phone2
      }
      invoice {
        address1
        address2
        city
        company
        country
        email
        firstName
        id
        invoiceType
        lastName
        orgNo
        phone
        phone2
        postcode
        referenceNo
        state
      }
      orderSchedule {
        serveAt
        deliverMinutesBefore
        drivingMinutesTime
        kitchenReadyAt
        pickup
        deliveryStart
        deliveryEnd
      }
      orderEquipment {
        deliveryAction
        daysBefore
        deliveryStart
        deliveryEnd
        pickupAction
        pickupDaysAfter
        deliveryAddress {
          id
          city
          address1
          address2
          postcode
          firstName
          lastName
          phone
          phone2
          venue {
            id
            name
          }
        }
        pickupAddress {
          id
          city
          address1
          address2
          postcode
          firstName
          lastName
          phone
          phone2
          venue {
            id
            name
          }
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
        internal
        orderNote
      }
      orderPrice {
        discount
        totalPrice
        finalPrice
      }
      orderArticles {
        id
        status
        customPrice
        position
        articlePrice
        article {
          id
          price
          quantityPerPerson
          accountingProductVat {
            id
            product {
              id
              name
              vatRate {
                id
                value
              }
            }
            category {
              id
              name
            }
          }
          food {
            id
            name
            hasArticle
            quantityType {
              id
              name
            }
            childFoodRelations {
              id
              position
              quantityPerPortion
              childFood {
                id
                hasArticle
                article {
                  id
                  quantityPerPerson
                }
              }
              quantityPerPortion
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
            description
            quantityType {
              id
              name
            }
          }
          transport {
            name
            description
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
            accountingProductVat {
              id
              product {
                id
                name
                vatRate {
                  id
                  value
                }
              }
              category {
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
            food {
              id
              name
              hasArticle
              childFoodRelations {
                id
                position
                quantityPerPortion
                childFood {
                  id
                  name
                  hasArticle
                  article {
                    id
                    quantityPerPerson
                  }
                  quantityType {
                    id
                    name
                  }
                }
              }
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
