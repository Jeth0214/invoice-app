import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
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


  constructor(
    private formBuilder: FormBuilder,
    private invoiceService: InvoiceService,
    private activeOffcanvas: NgbActiveOffcanvas,
  ) { }

  ngOnInit(): void {
    this.setForm();
    this.selectedTerms = this.terms[0].name;
  }

  setForm() {
    this.invoiceForm = this.formBuilder.group({
      description: ['', Validators.required],
      createdAt: [this.calculatePaymentDue(0, new Date()), Validators.required],
      paymentTerms: [1, Validators.required],
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]]
    });
  }


  get formValidation(): { [key: string]: AbstractControl } {
    return this.invoiceForm.controls;
  }

  onSaveNewInvoice(saveAs: string) {
    console.log(saveAs);
    console.log('status', this.invoiceForm.status);
    console.log('invoice', this.invoiceForm.value);
    console.log('item', this.invoiceForm.get('items')?.value.length);
    //check if save status is 'pending' or 'draft;
    // if draft , get the form value and save
    if (saveAs === 'draft') {
      this.isSaving = false;
      this.saveInvoiceData(saveAs)
    }
    // if pending , validate the form  before saving
    if (saveAs == 'pending') {
      this.isSaving = true;
      let itemslength = this.invoiceForm.get('items')?.value.length;
      //check if form is valid
      if (this.invoiceForm.invalid) {
        this.showInvalidMessage = true;
      }
      if (itemslength == undefined || itemslength < 1) {
        this.showNeedItemMessage = true;
      }
      if (this.invoiceForm.valid && itemslength > 0) {
        this.saveInvoiceData(saveAs);
      }
    }

  }

  saveInvoiceData(saveAs: string): void {
    this.showInvalidMessage = false;
    this.showNeedItemMessage = false;
    // store invoice form inputs to as initial invoice data
    let invoiceData: Invoice = {
      ...this.invoiceForm.value
    };

    // calculate all items sum and assign it  to invoice total data
    // check if the items exist especially on 'draft' status
    let itemsValues = this.invoiceForm.get('items')?.value;
    if (itemsValues) {
      invoiceData.total = itemsValues.reduce((total: any, item: any) => {
        return total + +item.total;
      }, 0);
    }

    // set the invoice id to created date in milliseconds and convert it to string;
    let id = +new Date(invoiceData.createdAt);
    invoiceData.id = `#${id.toString()}`;

    // add payment due to invoice data
    invoiceData.paymentDue = this.calculatePaymentDue(invoiceData.paymentTerms, invoiceData.createdAt);

    //set the invoice status according to saveAs state
    invoiceData.status = saveAs;
    console.log('Invoice Data: ', invoiceData);

    // send data for storage
    this.invoiceService.addInvoice(invoiceData).subscribe((invoice: Invoice) => {
      console.log('Response', invoice);
      if (invoice) {
        this.resetForm();
        setTimeout(() => {
          this.onDiscard();
        }, 1000);
      }
    })
  }

  resetForm(): void {
    this.isSaving = false;
    this.showInvalidMessage = false;
    this.showNeedItemMessage = false;
    this.selectedTerms = this.terms[0].name;
    this.invoiceForm.reset();
    this.invoiceForm.removeControl('items');
    this.invoiceForm.patchValue({ 'createdAt': this.calculatePaymentDue(0, new Date()) });
    this.invoiceForm.patchValue({ 'paymentTerms': 1 });
  }


  selectTerms(term: Term): void {
    this.selectedTerms = term.name;
    this.invoiceForm.patchValue({ 'paymentTerms': term.value })
  }


  calculatePaymentDue(paymentTerm: number = 0, createdDate: string | Date): string {
    var result = new Date(createdDate);
    result.setDate(result.getDate() + paymentTerm);
    let day = result.getDate();
    let year = result.getFullYear();
    let month = result.getMonth() + 1;
    return `${year}-${month}-${day}`;
  }

  onDiscard() {
    this.resetForm();
    this.activeOffcanvas.dismiss()
  }

}
