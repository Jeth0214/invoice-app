import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveOffcanvas, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Invoice, Item, Term, Address } from '../../shared/models/invoice.model';
import { InvoiceService } from '../../shared/services/invoice.service';

@Component({
  selector: 'app-add-edit-invoices',
  templateUrl: './add-edit-invoices.component.html',
  styleUrls: ['./add-edit-invoices.component.scss']
})
export class AddEditInvoicesComponent implements OnInit {
  // data from invoice list or invoice details offcanvas instance
  @Input() title!: string;
  @Input() invoice: Invoice | undefined;

  invoiceForm!: FormGroup;
  isSaving: boolean = false;
  showInvalidMessage: boolean = false;
  showNeedItemMessage: boolean = false;
  selectedTerms!: string;
  dateToday = new Date();
  isDropDownOpen = false;

  terms: Term[] = [
    { name: "Net 1 Day", value: 1 },
    { name: "Net 7 Days", value: 7 },
    { name: "Net 14 Days", value: 14 },
    { name: "Net 30 Days", value: 30 }
  ];


  constructor(
    private formBuilder: FormBuilder,
    private invoiceService: InvoiceService,
    private activeOffcanvas: NgbActiveOffcanvas
  ) { }

  ngOnInit(): void {
    this.setInvoiceForm();
    console.log(this.invoice)
    if (this.invoice) {
      console.log('Invoice from detail page: ', this.invoice);
      this.invoiceForm.patchValue({ 'description': this.invoice.description });
      this.invoiceForm.patchValue({ 'createdAt': this.invoice.createdAt });
      this.invoiceForm.patchValue({ 'paymentTerms': this.invoice.paymentTerms });
      this.invoiceForm.patchValue({ 'clientName': this.invoice.clientName });
      this.invoiceForm.patchValue({ 'clientEmail': this.invoice.clientEmail });
      this.dateToday = new Date(this.invoice.createdAt);
    }
    this.selectedTerms = this.terms[0].name;
  }

  setInvoiceForm() {
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
    // console.log(saveAs);
    console.log('status', this.invoiceForm.status);
    console.log('invoice', this.invoiceForm.value);
    //console.log('item', this.invoiceForm.get('items')?.value.length);

    //check if save status is 'pending' or 'draft;
    // if draft , get the form value and save
    if (saveAs === 'draft') {
      this.isSaving = false;
      this.saveInvoiceData(saveAs)
    }
    // if pending or editing, validate the form  before saving
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
    } else {
      invoiceData.total = 0;
      invoiceData.items = []
    }

    // check first if the status is edit invoice
    // set the invoice id to created date in milliseconds and convert it to string temporarily;

    if (this.invoice) {
      invoiceData.id = this.invoice.id
    } else {
      invoiceData.id = this.generateId()
    }

    // add payment due to invoice data
    invoiceData.paymentDue = this.calculatePaymentDue(invoiceData.paymentTerms, invoiceData.createdAt);

    //set the invoice status according to saveAs state
    invoiceData.status = saveAs;
    console.log('Invoice Data: ', invoiceData);
    if (this.invoice) {
      this.invoiceService.updateInvoice(invoiceData).subscribe((response) => {
        // Todo: If backend is ready, check if the invoice was created or updated successfully
        setTimeout(() => {
          this.onDiscard();
        }, 1000);
      })
    } else {
      // send data for storage
      this.invoiceService.addInvoice(invoiceData).subscribe((invoice: Invoice) => {
        // Todo: If backend is ready, check if the invoice was created or updated successfully
        setTimeout(() => {
          this.onDiscard();
        }, 1000);
      })
    }
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
    this.isDropDownOpen = false
    this.selectedTerms = term.name;
    this.invoiceForm.patchValue({ 'paymentTerms': term.value })
  }

  changeDropDownArrow() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }


  calculatePaymentDue(paymentTerm: number = 0, createdDate: string | Date): string {
    var result = new Date(createdDate);
    result.setDate(result.getDate() + paymentTerm);
    let day = result.getDate();
    let year = result.getFullYear();
    let month = result.getMonth() + 1;
    return `${year}-${month}-${day}`;
  }

  generateId(): string {
    return Math.random().toString(36).substring(7).split("").map(char => {
      return char.toUpperCase();
    }).join("");
  }

  onDiscard() {
    this.resetForm();
    this.activeOffcanvas.dismiss()
  }

  onDateSelect(date: NgbDate) {
    this.dateToday = new Date(date.year, date.month - 1, date.day);
  }

}
