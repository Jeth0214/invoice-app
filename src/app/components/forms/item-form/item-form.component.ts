import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class ItemFormComponent implements OnInit {

  invoiceForm!: FormGroup;

  constructor(
    private formParent: FormGroupDirective,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.invoiceForm = this.formParent.form;
    this.invoiceForm.addControl(
      'items',
      this.formBuilder.array([
        {
          name: ['', Validators.required],
          quantity: ['', Validators.required],
          price: ['', Validators.required],
        }
      ])
    )
  }

  get items() {
    return this.invoiceForm.controls['items'] as FormArray;
  }

  addNewItem() {
    console.log('click');
  }

}
