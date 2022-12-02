import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

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
  }

}
