import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Invoice } from '../../shared/models/invoice.model';
import { InvoiceService } from '../../shared/services/invoice.service';
import { AddEditInvoicesComponent } from '../add-edit-invoices/add-edit-invoices.component';
import { StorageService } from 'src/app/shared/services/storage.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvoiceDetailsComponent implements OnInit, AfterViewInit {

  
  showNoInvoice: boolean = false;
  invoice!: Invoice;
  isPaid: boolean = false;
  id: string = '';

  modalTitle: string = '';
  modalMessage: string = '';
  toDelete: boolean = true;

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
    private offcanvasService: NgbOffcanvas,
    private modalService: NgbModal,
    private router: Router,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.getInvoiceDetails();
  }


  ngAfterViewInit(): void {
    this.getInvoiceDetails();
  }


  getInvoiceDetails() {
    this.activatedRoute.paramMap.subscribe((param: ParamMap) => {
      let id = param.get('id');
      if (id) {
        this.id = id;
        this.getInvoiceFromLocalStorage(id);
        if (!this.invoice) {
          this.getInvoiceFromApi(id)
        }
      } else {
        this.router.navigate(['/invoices'])
        return;
      }
    })

    this.modalMessage = `Are you sure you want to delete invoice ${this.invoice.id} This action cannot be undone.`
  }

  getInvoiceFromLocalStorage(id: string) {
    this.invoice = this.storageService.getInvoice(id);
    this.isInvoicePaid(this.invoice?.status);
  };


  getInvoiceFromApi(id: string) {
    this.invoiceService.getInvoice(id).subscribe({
      next: (response: Invoice) => {
        if (response) {
          this.invoice = response;
          this.isInvoicePaid(response?.status)
        } else {
          this.showNoInvoice = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }

    })
  }

  isInvoicePaid(status?: string): void {
    if (this.invoice && status === 'paid') {
      this.isPaid = true
    }
  }

  onEdit(content: any) {
    this.modalService.dismissAll();
    document.body.style.overflow = 'unset';
    this.offcanvasService.open(content, { panelClass: 'off-canvas-width', animation: true });
  }


  onDelete(content: any) {
    this.modalTitle = `Confirm Deletion`
    this.modalMessage = `Are you sure you want to delete invoice ${this.invoice.id} This action cannot be undone.`
    this.toDelete = true;
    this.modalService.open(content, { centered: true });
  }

  deleteInvoice(id: string) {
    this.invoiceService.deleteInvoice(id).subscribe(data => {
      this.modalService.dismissAll();
      this.router.navigate(['/invoices']);
    })
  }


  onMarkAsPaid(invoice: Invoice, content: any) {
    if(invoice.status === 'draft') {
      this.modalTitle = 'Mark Invoice as Paid';
      this.modalMessage = `Please complete the invoice form to mark this as paid.`;
      this.toDelete = false;
      this.modalService.open(content, { centered: true });
      return
    }
    let paidInvoice =  invoice;
    paidInvoice.status = 'paid';
    this.invoiceService.updateInvoice(paidInvoice).subscribe(data => {
      console.log(data);
      this.invoice.status = 'paid';
      this.isPaid = true
    })
  };

  updateInvoice(event: Invoice) {
    console.log(event)
    this.invoice = event
  }


}
