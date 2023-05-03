import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveOffcanvas, NgbDate, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
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
  @Output() emitInvoice = new EventEmitter();

  invoiceForm!: FormGroup;
  isSaving: boolean = false;
  showInvalidMessage: boolean = false;
  showNeedItemMessage: boolean = false;
  selectedTerms!: string;
  createdDate = '';
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
    private offcanvasService: NgbOffcanvas,
  ) { }

  ngOnInit(): void {
    this.setInvoiceForm();
    //  console.log(this.invoice)
    if (this.invoice) {
      console.log('Invoice from detail page: ', this.invoice);
      this.invoiceForm.patchValue({ 'description': this.invoice.description });
      this.invoiceForm.patchValue({ 'invoiceDate': this.invoice.createdAt });
      this.invoiceForm.patchValue({ 'paymentTerms': this.invoice.paymentTerms });
      this.invoiceForm.patchValue({ 'clientName': this.invoice.clientName });
      this.invoiceForm.patchValue({ 'clientEmail': this.invoice.clientEmail });
      this.createdDate = this.invoice.createdAt;
    }
    this.selectedTerms = this.terms[0].name;
  }

  //Set the form
  setInvoiceForm() {
    this.invoiceForm = this.formBuilder.group({
      description: ['', Validators.required],
      invoiceDate: [this.formatDateToday(new Date()), Validators.required],
      paymentTerms: [1, Validators.required],
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]]
    });
  }

  // use getter to get form info easily
  get formValidation(): { [key: string]: AbstractControl } {
    return this.invoiceForm.controls;
  }

  onSaveNewInvoice(saveAs: string) {
    // console.log('status', this.invoiceForm.status);
    // console.log('invoice', this.invoiceForm.value);

    this.isSaving = true;
    let itemslength = this.invoiceForm.get('items')?.value.length;
    //check if form is valid
    if (this.invoiceForm.invalid) {
      this.showInvalidMessage = true;
    }
    if (itemslength == undefined || itemslength <= 0) {
      this.showNeedItemMessage = true;
    }
    if (this.invoiceForm.valid && itemslength > 0) {
      this.saveInvoiceData(saveAs);
    }
  }

  saveInvoiceData(saveAs: string): void {
    this.showInvalidMessage = false;
    this.showNeedItemMessage = false;
    let dataToSend = this.setInvoiceDataToSend(saveAs)
    // console.log('Invoice Data: ', invoiceData);
    if (this.invoice && this.title === 'Edit') {
      this.invoiceService.updateInvoice(dataToSend).subscribe((response) => {
        // Todo: If backend is ready, check if the invoice was created or updated successfully
        this.emitInvoice.emit(dataToSend)
        this.onDiscard();
      })
    } else {
      // send data for storage
      this.invoiceService.addInvoice(dataToSend).subscribe((invoice: Invoice) => {
        // Todo: If backend is ready, check if the invoice was created or updated successfully
        console.log('Create Response: ', invoice);
        if (invoice) {

          this.emitInvoice.emit(invoice)
          this.onDiscard();
        }
      })
    }
  }

  setInvoiceDataToSend(saveAs: string) {
    // store invoice form inputs to as initial invoice data
    let invoiceData = {
      ...this.invoiceForm.value
    };

    // remove invoiceDate from data to send
    delete invoiceData.invoiceDate;

    //set the invoice createdAt property from createdDate,
    invoiceData.createdAt = this.createdDate;

    // calculate all items sum and assign it  to invoice total data
    let itemsValues = this.invoiceForm.get('items')!.value;
    if (itemsValues) {
      invoiceData.total = itemsValues.reduce((total: any, item: any) => {
        return total + +item.total;
      }, 0);
    }

    // check first if the status is edit 
    // set the invoice id to created date in milliseconds and convert it to string ;

    if (this.invoice) {
      invoiceData.id = this.invoice.id
    } else {
      invoiceData.id = this.generateId()
    }

    // add payment due to invoice data
    invoiceData.paymentDue = this.calculatePaymentDue(invoiceData.paymentTerms, invoiceData.createdAt);

    //set the invoice status according to saveAs state
    invoiceData.status = saveAs;

    return invoiceData
  }

  resetForm(): void {
    this.isSaving = false;
    this.showInvalidMessage = false;
    this.showNeedItemMessage = false;
    this.selectedTerms = this.terms[0].name;
    this.invoiceForm.reset();
    this.invoiceForm.removeControl('items');
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
    // console.log('Term: ', paymentTerm);
    // console.log('Created Term: ', createdDate);
    let result = new Date(createdDate);
    result.setDate(result.getDate() + paymentTerm);
    return this.formatDateToday(result);
  }

  generateId(): string {
    return Math.random().toString(36).substring(7).split("").map(char => {
      return char.toUpperCase();
    }).join("");
  }

  onDiscard() {
    this.resetForm();
    this.offcanvasService.dismiss();
  }

  onDateSelect(date: NgbDate) {
    this.createdDate = this.formatDateToday(new Date(`${date.year}-${date.month}-${date.day}`));
    this.invoiceForm.patchValue({ 'invoiceDate': this.createdDate })
    // console.log('created Date', this.createdDate)
    // console.log('Selected Date ', date);
  }


  // format the date 
  formatDateToday(date: Date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    let formattedDate = `${year}-${month}-${day}`;
    //  console.log('Converted Date: ', formattedDate);
    this.createdDate = formattedDate;
    return formattedDate;
  }

}
