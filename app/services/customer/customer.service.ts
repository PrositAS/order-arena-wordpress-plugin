import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Company } from 'src/@types/order-arena-user-portal/Company';
import { CompanyAddress } from 'src/@types/order-arena-user-portal/CompanyAddress';
import { Customer } from 'src/@types/order-arena-user-portal/Customer';
import { CustomerAddress } from 'src/@types/order-arena-user-portal/CustomerAddress';
import { ID } from 'src/@types/order-arena-user-portal/ID';
import { Address } from 'src/@types/order-arena-user-portal/order-form/Address';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import { User } from 'src/@types/order-arena-user-portal/User';
import { OrderMapperService } from '../order/order-mapper/order-mapper.service';

@Injectable()
export class CustomerService {
  constructor(
    private ngrx: Store<UPState>,
    private orderMapperService: OrderMapperService
  ) {}

  get user(): Observable<User> {
    return this.ngrx.pipe(select((store) => store.user));
  }

  getCustomer(): Observable<Customer> {
    return this.user.pipe(map((user) => user?.customer ?? null));
  }

  getCustomerAddresses(): Observable<CustomerAddress[]> {
    return this.getCustomer().pipe(map((customer) => customer?.customerAddresses ?? []));
  }

  getCompaniesAddresses(): Observable<CompanyAddress[]> {
    return this.getCustomer().pipe(
      map((customer) =>
        (customer?.companies ?? []).reduce(
          (addresses: CompanyAddress[], company: Company) => [...addresses, ...(company?.addresses ?? [])],
          []
        )
      )
    );
  }

  getAddresses(): Observable<(CustomerAddress | CompanyAddress)[]> {
    return combineLatest([this.getCustomerAddresses(), this.getCompaniesAddresses()]).pipe(
      map(([customerAddresses, companiesAddresses]) => [...customerAddresses, ...companiesAddresses])
    );
  }

  getMappedAddresses(): Observable<Address[]> {
    return this.getAddresses().pipe(
      map((addresses) => addresses.map((address) => this.orderMapperService.mapSourceToAddress(address)))
    );
  }

  getAddressById(id: ID, addresses: Address[] = null): Observable<Address> {
    return (addresses ? of(addresses) : this.getMappedAddresses()).pipe(
      map((addresses) => this.findAddressById(id, addresses))
    );
  }

  getAddressByComparison(address: Address, addresses: Address[] = null): Observable<Address> {
    return (addresses ? of(addresses) : this.getMappedAddresses()).pipe(
      map((addresses) => this.findAddressByComparison(address, addresses))
    );
  }

  findAddressById(id: ID, addresses: Address[] = []): Address {
    return addresses.find((address) => address.id === id) ?? null;
  }

  findAddressByComparison(address: Address, addresses: Address[] = []): Address {
    return addresses.find((a) => this.orderMapperService.isSameAddress(a, address)) ?? null;
  }

  findAddressIdByComparison(address: Address, addresses: Address[] = []): ID {
    const foundAddress: Address = this.findAddressByComparison(address, addresses);

    return foundAddress?.id ?? null;
  }

  verifyAddress(address: Address, addresses: Address[] = []): Address {
    if (!address) {
      return null;
    }

    if (!!address.id) {
      const existingAddress: Address = this.findAddressById(address.id, addresses);
      const shouldResetAddressId: boolean = !this.orderMapperService.isSameAddress(address, existingAddress);

      return shouldResetAddressId ? ({ ...address, id: null } as Address) : null;
    } else {
      return this.findAddressByComparison(address, addresses);
    }
  }
}
