import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Invoice } from '../../shared/models/invoice.model';
import { InvoiceService } from '../../shared/services/invoice.service';
import { AddEditInvoicesComponent } from '../add-edit-invoices/add-edit-invoices.component';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvoiceDetailsComponent implements OnInit, AfterViewInit {

  // no invoice div to add later
  showNoInvoice: boolean = false;
  invoice!: Invoice;
  isPaid: boolean = false;

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
    private offcanvasService: NgbOffcanvas,
    private modalService: NgbModal,
    private router: Router
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
        this.invoiceService.getInvoice(id).subscribe(data => {
          this.invoice = data;
          console.log('Invoice details: ', this.invoice);

          if (this.invoice.status === 'paid') {
            this.isPaid = true
          }
        })
      } else {
        this.showNoInvoice = true;
        return;
      }
    })
  }

  onEdit() {
    const offCanvasRef = this.offcanvasService.open(AddEditInvoicesComponent, { panelClass: 'off-canvas-width' });
    offCanvasRef.componentInstance.title = `Edit`;
    offCanvasRef.componentInstance.invoice = this.invoice;
  }


  onDelete(content: any) {
    this.modalService.open(content, { centered: true });
  }

  deleteInvoice(id: string) {
    this.invoiceService.deleteInvoice(id).subscribe(data => {
      this.modalService.dismissAll();
      this.router.navigate(['/invoices']);
    })
  }


  onMarkAsPaid(invoice: Invoice) {
    this.invoice.status = 'paid';
    console.log('mark as paid this invoice', invoice);
    this.invoiceService.updateInvoice(invoice).subscribe(data => {
      this.isPaid = true
    })
  }

}
