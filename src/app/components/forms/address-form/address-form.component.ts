import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Address, Invoice } from 'src/app/shared/models/invoice.model';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class AddressFormComponent implements OnInit {
  @Input() addressType!: string;
  @Input() isSaving!: boolean;
  @Input() addressData: Address | undefined;

  invoiceForm!: FormGroup;

  constructor(
    private formParent: FormGroupDirective,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    console.log('address type: ', this.addressType)
    this.invoiceForm = this.formParent.form;
    this.invoiceForm.addControl(
      this.addressType,
      this.formBuilder.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required]
      })
    )
    if (this.addressData) {
      (<FormGroup>this.invoiceForm.controls[this.addressType]).patchValue({
        'street': this.addressData.street,
        'city': this.addressData.city,
        'postCode': this.addressData.postCode,
        'country': this.addressData.country,
      })
    }
  };

  get address() {
    return this.invoiceForm.get(this.addressType) as FormGroup;
  }

  get street() {
    return this.address.get('street');
  }
  get postCode() {
    return this.address.get('postCode');
  }
  get city() {
    return this.address.get('city');
  }
  get country() {
    return this.address.get('country');
  }

  setAddressForm() {
    if (this.addressType === 'senderAddress' && !this.addressData) {
      this.invoiceForm.addControl(
        this.addressType,
        this.formBuilder.group({
          street: ['19 Union Terrace', Validators.required],
          city: ['London', Validators.required],
          postCode: ['E1 3EZ', Validators.required],
          country: ['United Kingdom', Validators.required]
        })
      )
    }
  }

}
