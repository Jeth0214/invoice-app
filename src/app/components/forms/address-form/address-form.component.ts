import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Address, Invoice } from 'src/app/shared/models/invoice.model';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class AddressFormComponent implements OnInit{
  @Input() addressType!: string;
  @Input() isSaving!: boolean;
  @Input() addressData: Address | undefined;
  @Input() isDraftSubject:Subject<boolean> | undefined;;

  invoiceForm!: FormGroup;

  constructor(
    private formParent: FormGroupDirective,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    // console.log('address type: ', this.addressType);
    // console.log('is Save As Draft? : ', this.isSaveAsDraft);
    this.isDraftSubject?.subscribe( event => console.log(event) );
    this.invoiceForm = this.formParent.form;
    this.invoiceForm.addControl(
      this.addressType,
      this.formBuilder.group(this.setAddressFormGroup(this.addressData))
    )
    // if (this.addressData) {
    //   (<FormGroup>this.invoiceForm.controls[this.addressType]).patchValue({
    //     'street': this.addressData.street,
    //     'city': this.addressData.city,
    //     'postCode': this.addressData.postCode,
    //     'country': this.addressData.country,
    //   })
    // }
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

  
  setAddressFormGroup(addressData: Address | undefined) {
    return {
        street: [ addressData?.street ? addressData?.street : ''],
        city: [addressData?.city ? addressData?.city : ''],
        postCode: [addressData?.postCode ? addressData?.postCode : ''],
        country: [addressData?.country ? addressData?.country : '']
    }
  }
}
