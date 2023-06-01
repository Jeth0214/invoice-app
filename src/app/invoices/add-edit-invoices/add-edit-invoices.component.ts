import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveOffcanvas, NgbDate, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Invoice, Item, Term, Address } from '../../shared/models/invoice.model';
import { InvoiceService } from '../../shared/services/invoice.service';
import { Subject } from 'rxjs';

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
  showSpinner: boolean = false;
  status = '';

  isDraftSubject:Subject<any> = new Subject<any>();

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
    console.log(this.invoice);
    this.setInvoiceForm();
    if (this.invoice) {
      this.createdDate = this.invoice.createdAt;
    }
    this.getSelectedTerm()
  }

  //Set the form
  setInvoiceForm() {
    this.invoiceForm = this.formBuilder.group({
      description: [ this.invoice ? this.invoice.description : '', Validators.required],
      invoiceDate: [  this.invoice ? this.invoice.createdAt : this.formatDateToday(new Date()), Validators.required],
      paymentTerms: [  this.invoice ? this.invoice.paymentTerms : 1, Validators.required],
      clientName: [  this.invoice ? this.invoice.clientName : '', Validators.required],
      clientEmail: [  this.invoice ? this.invoice.clientEmail : '', Validators.email]
    });
  }

  // use getter to get form info easily
  get formValidation(): { [key: string]: AbstractControl } {
    return this.invoiceForm.controls;
  }

  onSaveAsDraft() {
    // console.log('Save as Draft');
    this.invoiceForm.controls["clientEmail"].setValidators(null);
    this.invoiceForm.controls["clientEmail"].updateValueAndValidity({onlySelf: true});
    this.isDraftSubject.next(true);
    this.isSaving = true;
    this.showNeedItemMessage = this.itemsHasErrors();
    let requiredFieldsArray = ['description', 'clientName', 'senderAddress']; 
    let validityArray: any = [];
    requiredFieldsArray.forEach((field) => {
      if (!this.invoiceForm.controls[field].valid) {
        validityArray.push(field);
      }
     })
    if(validityArray.length > 0 || this.showNeedItemMessage) {return}; 
    this.saveInvoiceData('draft');
  }

  onSaveAndSend(status: string="pending") {
    console.log('Save and Send');
    this.isDraftSubject.next(false);
    this.isSaving = true;
    this.invoiceForm.controls["clientEmail"].setValidators([Validators.required, Validators.email]);
    this.invoiceForm.controls["clientEmail"].updateValueAndValidity({onlySelf: true});
    this.showNeedItemMessage = this.itemsHasErrors();
      this.showInvalidMessage = this.invoiceForm.invalid ? true : false;
    if (this.invoiceForm.valid && !this.showNeedItemMessage) {
      this.saveInvoiceData('pending');
    }
  }

  onSaveChanges() {
    let validData = this.invoiceForm.valid && !this.showNeedItemMessage ? true : false;
    if(this.invoice?.status == 'paid' && validData  ) { this.onSaveAndSend('paid'); };
    if((this.invoice?.status === 'draft' && validData) || validData ) {
      this.onSaveAndSend('pending');
    } else {
      this.onSaveAsDraft();
    };
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

  /**
   * Save Invoice to backend/ localstorage
   */

  saveInvoiceData(saveAs: string): void {
    this.status = saveAs;
    this.showSpinner = true;
    let dataToSend = this.setInvoiceDataToSend(saveAs)
    // console.log('Invoice Data: ', invoiceData);
    if (this.invoice && this.title === 'Edit') {
      this.invoiceService.updateInvoice(dataToSend).subscribe((response) => {
        // Todo: If backend is ready, check if the invoice was created or updated successfully
        this.showInvalidMessage = false;
    this.showNeedItemMessage = false;
        this.showSpinner = false;
        this.emitInvoice.emit(dataToSend)
        this.onDiscard();
      })
    } else {
      // send data for storage
      this.invoiceService.addInvoice(dataToSend).subscribe((invoice: Invoice) => {
        // Todo: If backend is ready, check if the invoice was created or updated successfully
        this.showSpinner = false;
        this.showInvalidMessage = false;
    this.showNeedItemMessage = false;
        if (invoice) {

          this.emitInvoice.emit(invoice)
          this.onDiscard();
        }
      })
    }
  }
  /*
  * HELPERS METHODS
  */


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

  // get selecterm on edit status
  getSelectedTerm() {
    if (this.invoice) {
      let getTermIndex = this.terms.findIndex(term => { return term.value === this.invoice!.paymentTerms });
      this.selectedTerms = this.terms[getTermIndex].name;
    } else {
      this.selectedTerms = this.terms[0].name;
    }
  }

  itemsHasErrors() : boolean {
    if(!this.invoiceForm.get('items')?.valid){ return true; };
    let itemslength = this.invoiceForm.get('items')?.value.length;
    return (itemslength == undefined || itemslength <= 0) ? true : false;
  }
}
