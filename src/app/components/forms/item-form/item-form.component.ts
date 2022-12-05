import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class ItemFormComponent implements OnInit {
  @Input()
  isSaving!: boolean;
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
        this.insertNewItemForm()
      ])
    )
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem() {
    console.log(this.items.controls)
    this.items.push(this.insertNewItemForm());
  }

  removeItem(item: number) {
    this.items.removeAt(item);
  };

  getValueForItemsTotal(item: any, index: number) {
    if (item.value.quantity && item.value.price) {
      let total: number = item.value.quantity * item.value.price;
      this.items.controls[index].patchValue({ 'total': total.toFixed(2) })
    }
  }


  insertNewItemForm(): FormGroup {
    return new FormGroup({
      'name': new FormControl('', Validators.required),
      'quantity': new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('/^([0-9]*[1-9][0-9]*(\.[0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$/')]),
      'price': new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('/^([0-9]*[1-9][0-9]*(\.[0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$/')]),
      'total': new FormControl(''),
    })
  }

}
