import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Invoice, Term } from '../invoice.model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-add-edit-invoices',
  templateUrl: './add-edit-invoices.component.html',
  styleUrls: ['./add-edit-invoices.component.scss']
})
export class AddEditInvoicesComponent implements OnInit {

  invoiceForm!: FormGroup;
  isSaving: boolean = false;
  showInvalidMessage: boolean = false;
  showNeedItemMessage: boolean = false;
  selectedTerms!: string;

  terms: Term[] = [
    { name: "Net 1 Day", value: 1 },
    { name: "Net 7 Day", value: 7 },
    { name: "Net 14 Day", value: 14 },
    { name: "Net 30 Day", value: 30 }
  ];


  constructor(private formBuilder: FormBuilder, private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.invoiceForm = this.formBuilder.group({
      description: ['', Validators.required],
      createdAt: [this.calculatePaymentDue(0, new Date()), Validators.required],
      paymentTerms: [1, Validators.required],
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]]
    });

    this.selectedTerms = this.terms[0].name;
  }


  get formValidation(): { [key: string]: AbstractControl } {
    return this.invoiceForm.controls;
  }

  onSaveNewInvoice() {
    this.isSaving = true;
    // console.log('status', this.invoiceForm.status);
    // console.log('Invoice', this.invoiceForm.value);
    // console.log('Item', this.invoiceForm.get('items')?.value.length);
    //check if form is valid
    if (this.invoiceForm.invalid) {
      this.showInvalidMessage = true;
    }
    if (this.invoiceForm.get('items')?.value.length <= 0) {
      this.showNeedItemMessage = true;
    }
    if (this.invoiceForm.valid && this.invoiceForm.get('items')?.value.length > 0) {
      this.showInvalidMessage = false;
      this.showNeedItemMessage = false;
      // store invoice form inputs to as initial invoice data
      let invoiceData: Invoice = {
        ...this.invoiceForm.value
      };

      // calculate all items sum and assign it  to invoice total data
      let itemsValues = this.invoiceForm.get('items')?.value;
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

      this.invoiceService.addInvoice(invoiceData).subscribe((invoice: Invoice) => {
        console.log('Response', invoice);
        if (invoice) {
          this.resetForm()
        }
      })
    }

  }

  resetForm(): void {
    this.isSaving = false;
    this.showInvalidMessage = false;
    this.showNeedItemMessage = false;
    this.selectedTerms = this.terms[0].name;
    this.invoiceForm.reset();
  }


  selectTerms(term: Term): void {
    this.selectedTerms = term.name;
    this.invoiceForm.patchValue({ 'paymentTerms': term.value })
  }


  calculatePaymentDue(paymentTerm: number, createdDate: string | Date): string {
    var result = new Date(createdDate);
    result.setDate(result.getDate() + paymentTerm);
    let day = result.getDate();
    let year = result.getFullYear();
    let month = result.getMonth() + 1;
    return `${year}-${month}-${day}`;
  }

}
