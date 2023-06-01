import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators
} from '@angular/forms';
import { ValidateMinNum } from 'src/app/shared/minNum.validator';
import { Item } from 'src/app/shared/models/invoice.model';



@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})

export class ItemFormComponent implements OnInit {
  @Input() isSaving!: boolean;
  @Input() itemsFromInvoiceToEdit: Item[] | undefined;
  invoiceForm!: FormGroup;


  constructor(
    private formParent: FormGroupDirective,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.invoiceForm = this.formParent.form;
    if (this.itemsFromInvoiceToEdit) {
      this.itemsFromInvoiceToEdit.forEach(item => {
        this.addItem(item)
      });
    }


  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(item?: Item) {
    if (!this.invoiceForm.contains('items')) {
      this.invoiceForm.addControl(
        'items',
        this.formBuilder.array([
          this.insertNewItemForm(item)
        ])
      )
    } else {

      this.items.push(this.insertNewItemForm(item));
    }
  }

  removeItem(item: number) {
    //console.log('removeItem', this.items.length)
    this.items.removeAt(item);
    if (this.items.length <= 0) {
      this.addItem();
    }
  };

  getValueForItemsTotal(item: any, index: number, e: Event) {
    console.log(item.value.quantity , item.value.price)
    if (item.value.quantity && item.value.price) {
      let total: number = item.value.quantity * item.value.price;
      this.items.controls[index].patchValue({ 'total': +total.toFixed(2) }) 
    }
  }


  insertNewItemForm(item?: Item): FormGroup {

    return new FormGroup({
      'name': new FormControl(item ? item.name : '', Validators.required),
      'quantity': new FormControl(item ? item.quantity : '', [Validators.required, ValidateMinNum]),
      'price': new FormControl(item ? item.price : '', [Validators.required, ValidateMinNum]),
      'total': new FormControl(item ? item.total : '', Validators.required)
    })
  }

}
