import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { distinctUntilChanged, Observable, shareReplay, startWith } from 'rxjs';
import { CompanyInvoiceForm } from 'src/@types/order-arena-user-portal/order-form/CompanyInvoice';
import { InvoiceForm } from 'src/@types/order-arena-user-portal/order-form/Invoice';
import { PersonalInvoiceForm } from 'src/@types/order-arena-user-portal/order-form/PersonalInvoice';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss'],
})
export class InvoiceFormComponent implements OnInit {
  @Input({ required: true }) form!: FormGroup<InvoiceForm>;

  isCompanyInvoice$: Observable<boolean>;

  ngOnInit(): void {
    this.isCompanyInvoice$ = this.controls.forCompany.valueChanges.pipe(
      startWith(!!this.form.controls.forCompany.value),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  get controls(): InvoiceForm {
    return this.form.controls;
  }

  get personalInvoiceForm(): FormGroup<PersonalInvoiceForm> {
    return this.controls.personalInvoice;
  }

  get companyInvoiceForm(): FormGroup<CompanyInvoiceForm> {
    return this.controls.companyInvoice;
  }
}
