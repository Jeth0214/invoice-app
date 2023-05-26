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
  showAddressErrors: boolean | undefined;

  constructor(
    private formParent: FormGroupDirective,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    // console.log('address type: ', this.addressType);
    // console.log('is Save As Draft? : ', this.isSaveAsDraft);
    this.invoiceForm = this.formParent.form;
    this.invoiceForm.addControl(
      this.addressType,
      this.formBuilder.group(this.setAddressFormGroup(this.addressData))
      );
      // this.addValidation();
      this.isDraftSubject!.subscribe( isDraft => {
        console.log('isDraft', isDraft) ;
        // if(isDraft) { this.addValidation();}
        console.log('address Type: ', this.addressType);
    
          this.showAddressErrors = isDraft && this.addressType == 'clientAddress' ?  false : true;
      }
    );
      
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
        street: [ addressData?.street ? addressData?.street : '' , [Validators.required]],
        city: [addressData?.city ? addressData?.city : '' , [Validators.required]],
        postCode: [addressData?.postCode ? addressData?.postCode : '' , [Validators.required]],
        country: [addressData?.country ? addressData?.country : '' , [Validators.required]]
    }
  }


  addValidation() {
    this.street?.setValidators([Validators.required]);
    this.postCode?.setValidators([Validators.required]);
    this.city?.setValidators([Validators.required]);
    this.country?.setValidators([Validators.required]);
  }
}
