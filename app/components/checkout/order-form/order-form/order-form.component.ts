import { Time } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Moment } from 'moment';
import {
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { ID } from 'src/@types/order-arena-user-portal/ID';
import { AdditionalInfoForm } from 'src/@types/order-arena-user-portal/order-form/AdditionalInfo';
import { AddressForm } from 'src/@types/order-arena-user-portal/order-form/Address';
import { CompanyInvoiceForm } from 'src/@types/order-arena-user-portal/order-form/CompanyInvoice';
import { DeliveryAddressForm } from 'src/@types/order-arena-user-portal/order-form/DeliveryAddress';
import { DeliveryTimeForm } from 'src/@types/order-arena-user-portal/order-form/DeliveryTime';
import {
  initOrderData,
  noEventControlOptions,
} from 'src/@types/order-arena-user-portal/order-form/InitValues';
import { InvoiceForm } from 'src/@types/order-arena-user-portal/order-form/Invoice';
import { Order, OrderData, OrderForm } from 'src/@types/order-arena-user-portal/order-form/Order';
import { PersonalInvoiceForm } from 'src/@types/order-arena-user-portal/order-form/PersonalInvoice';
import { User } from 'src/@types/order-arena-user-portal/User';
import { AuthService } from 'src/app/@core/auth.service';
import { BroadcasterService, EVENTS } from 'src/app/@core/broadcaster.service';
import { OrderFormService } from 'src/app/services/order/order-form/order-form.service';
import { OrderTimeService } from 'src/app/services/order/order-form/order-time.service';
import { DeliveryDateValidator } from 'src/app/services/order/order-form/validators/delivery-date.validator';
import { deliveryStartValidator } from 'src/app/services/order/order-form/validators/delivery-start.validator';
import { eatingTimeValidator } from 'src/app/services/order/order-form/validators/eating-time.validator';
import { TranslatedSnackBarService } from 'src/app/services/translated-snack-bar/translated-snack-bar.service';
import { OrderConfirmationDialogComponent } from 'src/app/shadowed-components/order-confirmation-dialog/order-confirmation-dialog.component';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit {
  user$: Observable<User>;
  loggedIn$: Observable<boolean>;
  isBasketEmpty$: Observable<boolean>;
  isEquipmentDelivery$: Observable<boolean>;

  isPickup$: Observable<boolean>;
  useInvoiceAddress$: Observable<boolean>;
  doDeliveryInfo$: Observable<boolean>;
  minGuests$: Observable<number>;

  totalPrice$: Observable<number>;

  loading$: Observable<boolean>;

  minGuestsValidator: ValidatorFn = Validators.min(1);

  invoiceForm = new FormGroup<InvoiceForm>({
    forCompany: new FormControl<boolean>(false, { validators: Validators.required, updateOn: 'change' }),
    personalInvoice: new FormGroup<PersonalInvoiceForm>({
      name: new FormControl<string>(null, Validators.required),
      surname: new FormControl<string>(null, Validators.required),
      email: new FormControl<string>(null, [Validators.required, Validators.email]),
      phone: new FormControl<string>(null, Validators.required),
      address: new FormGroup<AddressForm>({
        id: new FormControl<ID>(null),
        street: new FormControl<string>(null, Validators.required),
        apartment: new FormControl<string>(null),
        postal: new FormControl<string>(null, Validators.required),
        city: new FormControl<string>(null, Validators.required),
      }),
    }),
    companyInvoice: new FormGroup<CompanyInvoiceForm>({
      name: new FormControl<string>(null, Validators.required),
      surname: new FormControl<string>(null, Validators.required),
      email: new FormControl<string>(null, [Validators.required, Validators.email]),
      phone: new FormControl<string>(null, Validators.required),
      address: new FormGroup<AddressForm>({
        id: new FormControl<ID>(null),
        street: new FormControl<string>(null, Validators.required),
        apartment: new FormControl<string>(null),
        postal: new FormControl<string>(null, Validators.required),
        city: new FormControl<string>(null, Validators.required),
      }),
      company: new FormControl<string>(null, Validators.required),
      companyNumber: new FormControl<string>(null, Validators.required),
    }),
  });
  deliveryAddressForm = new FormGroup<DeliveryAddressForm>({
    useInvoiceAddress: new FormControl<boolean>(false, {
      validators: Validators.required,
      updateOn: 'change',
    }),
    address: new FormGroup<AddressForm>({
      id: new FormControl<ID>(null),
      street: new FormControl<string>(null, Validators.required),
      apartment: new FormControl<string>(null),
      postal: new FormControl<string>(null, Validators.required),
      city: new FormControl<string>(null, Validators.required),
    }),
  });
  deliveryTimeForm = new FormGroup<DeliveryTimeForm>({
    date: new FormControl<Moment>(
      null,
      Validators.required,
      this.deliveryDateValidator.validate.bind(this.deliveryDateValidator)
    ),
    deliveryStart: new FormControl<Time>(null, [
      Validators.required,
      deliveryStartValidator(this.orderTimeService),
    ]),
    deliveryEnd: new FormControl<Time>({ value: null, disabled: true }),
    eatingTime: new FormControl<Time>(null, eatingTimeValidator(this.orderTimeService)),
  });
  additionalInfoForm = new FormGroup<AdditionalInfoForm>({
    doDeliveryInfo: new FormControl<boolean>(false, { validators: Validators.required, updateOn: 'change' }),
    deliveryInfo: new FormControl<string>(null, Validators.required),
    guests: new FormControl<number>(null, [Validators.required, Validators.min(1)]),
    notes: new FormControl<string>(null),
  });

  form = new FormGroup<OrderForm>(
    {
      user: new FormControl<User>(null, Validators.required),
      isOrderArticlesValid: new FormControl<boolean>(false, Validators.requiredTrue),
      isPickup: new FormControl<boolean>(false, { validators: Validators.required, updateOn: 'change' }),
      pastOrderData: new FormControl<OrderData>({ ...initOrderData }),
      invoice: this.invoiceForm,
      deliveryAddress: this.deliveryAddressForm,
      deliveryTime: this.deliveryTimeForm,
      additionalInfo: this.additionalInfoForm,
      termsAndConditions: new FormControl<boolean>(false, {
        validators: Validators.requiredTrue,
        updateOn: 'change',
      }),
    },
    { updateOn: 'blur' }
  );

  destroyRef = inject(DestroyRef);

  get controls(): OrderForm {
    return this.form.controls;
  }

  get pastOrderData(): FormControl<OrderData> {
    return this.controls.pastOrderData;
  }

  get personalInvoiceAddressForm(): FormGroup<AddressForm> {
    return this.invoiceForm.controls.personalInvoice.controls.address;
  }

  get companyInvoiceAddressForm(): FormGroup<AddressForm> {
    return this.invoiceForm.controls.companyInvoice.controls.address;
  }

  get termsAndConditionsControl(): FormControl<boolean> {
    return this.form.controls.termsAndConditions;
  }

  constructor(
    private bs: BroadcasterService,
    private authService: AuthService,
    private orderFormService: OrderFormService,
    private orderTimeService: OrderTimeService,
    private deliveryDateValidator: DeliveryDateValidator,
    private matDialog: MatDialog,
    private translatedSnackBarService: TranslatedSnackBarService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.bs
      .on(EVENTS.LOGIN)
      .pipe(
        distinctUntilChanged(),
        filter((loggedIn) => loggedIn === false),
        tap(() => this.form.reset())
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.user$ = this.authService.user.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged(),
      tap((user) => this.controls.user.setValue(user)),
      shareReplay(1)
    );

    this.user$
      .pipe(
        filter((user) => !!user),
        distinctUntilChanged(),
        switchMap(() => this.orderFormService.initOrderFormWithStoreData(this.form)),
        take(1)
      )
      .subscribe();

    this.loggedIn$ = this.authService.loggedIn.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(false),
      distinctUntilChanged(),
      tap((loggedIn) => {
        if (loggedIn) {
          this.controls.pastOrderData.enable(noEventControlOptions);
        } else {
          this.controls.pastOrderData.disable(noEventControlOptions);
        }
        this.controls.pastOrderData.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }),
      shareReplay(1)
    );

    this.isBasketEmpty$ = this.orderFormService.isBasketEmpty().pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(false),
      distinctUntilChanged(),
      tap((isEmpty) => {
        this.controls.isOrderArticlesValid.setValue(!isEmpty);
      })
    );
    this.isBasketEmpty$.subscribe();

    this.isEquipmentDelivery$ = this.orderFormService
      .isEquipmentInBasket()
      .pipe(distinctUntilChanged(), startWith(false));

    this.orderFormService.isPickup$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        startWith(false),
        tap((isPickup) => this.controls.isPickup.setValue(isPickup))
      )
      .subscribe();

    this.isPickup$ = this.controls.isPickup.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(false),
      distinctUntilChanged(),
      tap((isPickup) => {
        this.saveForm('isPickup');

        if (isPickup) {
          this.deliveryAddressForm.disable();
        } else {
          this.deliveryAddressForm.enable();

          if (this.deliveryAddressForm.value.useInvoiceAddress === true) {
            this.deliveryAddressForm.controls.address.disable();
          }
        }

        this.deliveryAddressForm.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      })
    );

    const isCompanyInvoice$: Observable<boolean> = this.invoiceForm.controls.forCompany.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(this.invoiceForm.controls.forCompany.value),
      distinctUntilChanged(),
      tap((forCompany) => this.orderFormService.handleInvoiceFormStatus(this.invoiceForm, forCompany))
    );
    isCompanyInvoice$.subscribe();

    this.useInvoiceAddress$ = this.deliveryAddressForm.controls.useInvoiceAddress.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged(),
      startWith(this.deliveryAddressForm.controls.useInvoiceAddress.value),
      tap((useInvoiceAddress) =>
        this.orderFormService.handleDeliveryAddressFormStatus(this.deliveryAddressForm, useInvoiceAddress)
      )
    );
    this.useInvoiceAddress$.subscribe();

    const deliveryTimeFormUpdated$ = this.deliveryTimeForm.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged(),
      withLatestFrom(this.orderFormService.minTimespanForDelivery$),
      tap(([deliveryTime, minTimespanForDelivery]) => {
        this.orderFormService.validateDeliveryTime(
          this.deliveryTimeForm,
          deliveryTime,
          minTimespanForDelivery
        );
        this.saveForm('deliveryTime');
      })
    );
    deliveryTimeFormUpdated$.subscribe();

    this.doDeliveryInfo$ = this.additionalInfoForm.controls.doDeliveryInfo.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged(),
      startWith(this.additionalInfoForm.controls.doDeliveryInfo.value),
      tap((doDeliveryInfo) =>
        this.orderFormService.handleAdditionalInfoFormStatus(this.additionalInfoForm, doDeliveryInfo)
      )
    );
    this.doDeliveryInfo$.subscribe();

    this.minGuests$ = this.orderFormService.calculateMinGuests().pipe(
      startWith(1),
      distinctUntilChanged(),
      tap((minGuests) => this.updateMinGuestsValidator(minGuests))
    );

    const maxGuests$ = this.orderFormService.calculateMaxGuests().pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(this.additionalInfoForm.controls.guests.value),
      distinctUntilChanged(),
      tap((maxGuests) => this.additionalInfoForm.controls.guests.patchValue(maxGuests))
    );
    maxGuests$.subscribe();

    const additionalInfoFormUpdated$ = this.additionalInfoForm.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => this.saveForm('additionalInfo'))
    );
    additionalInfoFormUpdated$.subscribe();

    this.totalPrice$ = this.orderFormService.calculateTotalPrice();

    const loadingStart$: Observable<boolean> = this.bs.on(EVENTS.ORDER_REQUEST_SENT).pipe(map(() => true));
    const loadingEnd$: Observable<boolean> = merge(
      this.bs.on(EVENTS.ORDER_REQUEST_COMPLETED),
      this.bs.on(EVENTS.ORDER_REQUEST_FAILED)
    ).pipe(map(() => false));
    this.loading$ = merge(loadingStart$, loadingEnd$).pipe(startWith(false), shareReplay(1));
  }

  updateMinGuestsValidator(minGuests: number): void {
    this.additionalInfoForm.controls.guests.removeValidators(this.minGuestsValidator);
    this.minGuestsValidator = Validators.min(minGuests);
    this.additionalInfoForm.controls.guests.addValidators(this.minGuestsValidator);
    this.additionalInfoForm.updateValueAndValidity();
  }

  saveForm(formName: string = null): void {
    if (this.form) {
      if ((formName === null || formName === '') && this.form.valid) {
        this.orderFormService.updateStore(formName, this.form.getRawValue() as Partial<Order>);
      }

      const form = this.form.controls[formName];
      if (form) {
        const order: Partial<Order> = {};
        order[formName] = form.getRawValue();
        this.orderFormService.updateStore(formName, order);
      }
    }
  }

  completeOrder(): void {
    if (this.form.valid) {
      this.orderFormService
        .completeOrder(this.form.getRawValue() as Partial<Order>)
        .pipe(
          take(1),
          filter((orderRequest) => !!orderRequest),
          tap((orderRequest) => {
            this.matDialog.open(OrderConfirmationDialogComponent, {
              height: '98vh',
              width: '98vw',
              maxWidth: '98vw',
              panelClass: 'order-confirmation-dialog',
              disableClose: true,
              data: {
                orderRequest,
              },
            });
          })
        )
        .subscribe();
    } else {
      this.translatedSnackBarService.open('ERROR_ORDER_FORM_INVALID', 'OK');
      this.orderFormService.validateAllFormFields(this.form);
      this.changeDetectorRef.detectChanges();
    }
  }
}
