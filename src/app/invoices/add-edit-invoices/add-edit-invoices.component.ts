import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-invoices',
  templateUrl: './add-edit-invoices.component.html',
  styleUrls: ['./add-edit-invoices.component.scss']
})
export class AddEditInvoicesComponent implements OnInit {

  invoiceForm: FormGroup;

  terms = [
    { name: "Net 1 Day", value: 1 },
    { name: "Net 7 Day", value: 7 },
    { name: "Net 14 Day", value: 14 },
    { name: "Net 30 Day", value: 30 }
  ];

  selectedTerms!: string;

  constructor(private formBuilder: FormBuilder) {
    this.invoiceForm = this.formBuilder.group({
      description: ['', Validators.required],
      createdAt: ['', Validators.required],
      paymentTerms: ['', Validators.required],
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      items: this.formBuilder.array([this.insertNewItemForm()])
    });

    this.selectedTerms = this.terms[0].name;

  }

  ngOnInit(): void {
  }

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.insertNewItemForm());
  }

  removeItem(item: number) {
    if (this.items.length == 1) {
      this.items.reset();
      this.addItem();
    };
    this.items.removeAt(item);
  };


  selectTerms(term: any) {
    this.selectedTerms = term.name;
    this.invoiceForm.patchValue({ 'paymentTerms': term.name })
  }

  onSubmit() {
    console.log(this.invoiceForm.value);
    let invoiceData = {
      ...this.invoiceForm.value
    };
    console.log('Invoice Data', invoiceData)
  }

  getValueForItemsTotal(item: any, index: number) {
    // console.log(item);
    // console.log(index);
    if (item.value.quantity && item.value.price) {
      let total: number = item.value.quantity * item.value.price;
      console.log(total.toFixed(2))
      this.items.controls[index].patchValue({ 'total': total.toFixed(2) })
    }
  }

  insertNewItemForm(): FormGroup {
    return new FormGroup({
      'name': new FormControl('', Validators.required),
      'quantity': new FormControl('', [Validators.required, Validators.min(1)]),
      'price': new FormControl('', [Validators.required, Validators.min(1)]),
      'total': new FormControl(''),
    })
  }

  calculatePaymentDue(paymentTerm: number, createdDate: Date) {
    let startDate = new Date(createdDate);
    return startDate.setDate(startDate.getDay() + paymentTerm);
  }

}
