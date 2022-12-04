import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-invoices',
  templateUrl: './add-edit-invoices.component.html',
  styleUrls: ['./add-edit-invoices.component.scss']
})
export class AddEditInvoicesComponent implements OnInit {

  invoiceForm: FormGroup;
  isSaving: boolean = false;

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
      createdAt: [this.calculatePaymentDue(0, new Date()), Validators.required],
      paymentTerms: [1, Validators.required],
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

  get formValidation(): { [key: string]: AbstractControl } {
    return this.invoiceForm.controls;
  }

  onSaveNewInvoice() {
    // store invoice form inputs to as initial invoice data
    this.isSaving = true;
    let invoiceData = {
      ...this.invoiceForm.value
    };

    // calculate all items sum and assign it  to invoice total data
    let itemsValues = this.items.value;
    invoiceData.total = itemsValues.reduce((total: any, item: any) => {
      return total + +item.total;
    }, 0);

    // set the invoice id to created date in milliseconds and convert it to string;
    let id = +new Date(invoiceData.createdAt);
    invoiceData.id = `#${id.toString()}`;

    // add payment due to invoice data
    invoiceData.paymentDue = this.calculatePaymentDue(invoiceData.paymentTerms, invoiceData.createdAt);

    //set the invoice status pending as default
    invoiceData.status = 'pending';

    console.log('Invoice', invoiceData);
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
    this.invoiceForm.patchValue({ 'paymentTerms': term.value })
  }


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

  calculatePaymentDue(paymentTerm: number, createdDate: string | Date) {
    var result = new Date(createdDate);
    result.setDate(result.getDate() + paymentTerm);
    let day = result.getDate();
    let year = result.getFullYear();
    let month = result.getMonth() + 1;
    return `${year}-${month}-${day}`;
  }

}
