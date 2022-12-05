import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class AddressFormComponent implements OnInit {
  @Input()
  addressType!: string;
  invoiceForm!: FormGroup;
  @Input() isSaving!: boolean;

  constructor(
    private formParent: FormGroupDirective,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
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

}
