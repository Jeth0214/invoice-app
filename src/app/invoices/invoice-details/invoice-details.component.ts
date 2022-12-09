import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Invoice } from '../../shared/models/invoice.model';
import { InvoiceService } from '../../shared/services/invoice.service';
import { AddEditInvoicesComponent } from '../add-edit-invoices/add-edit-invoices.component';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {

  // no invoice div to add later
  showNoInvoice: boolean = false;
  invoice!: Invoice;

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private offcanvasService: NgbOffcanvas
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param: ParamMap) => {
      let id = param.get('id');
      if (id) {
        this.invoiceService.getInvoice(id).subscribe(data => {
          this.invoice = data;
        })
      } else {
        this.showNoInvoice = true;
        return;
      }
    })
  }

  onEdit() {
    const offCanvasRef = this.offcanvasService.open(AddEditInvoicesComponent, { panelClass: 'off-canvas-width' });
    offCanvasRef.componentInstance.title = `Edit #${this.invoice.id}`;
    offCanvasRef.componentInstance.invoice = this.invoice;
  }


  onDelete() {
    console.log('delete');
  }


  onMarkAsPaid(invoice: Invoice) {
    console.log('mark as paid this invoice', invoice);
  }

}
