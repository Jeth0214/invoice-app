import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbOffcanvas, NgbOffcanvasConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddEditInvoicesComponent } from '../add-edit-invoices/add-edit-invoices.component';
import { Invoice } from '../../shared/models/invoice.model';
import { InvoiceService } from '../../shared/services/invoice.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss']
})
export class InvoicesListComponent implements OnInit, AfterViewInit {

  invoices: Invoice[] = [];
  tempInvoicesArray: Invoice[] = [];
  totalInvoicesMessage: string = 'No invoices';
  status: string[] = ['Draft', 'Pending', 'Paid'];
  showAllInvoices: boolean = false;
  hasInvoices: boolean = false;
  isDropDownOpen = false;

  statusForm = new FormGroup({
    status: new FormControl('', Validators.required)
  });

  constructor(
    private invoiceService: InvoiceService,
    private offcanvasService: NgbOffcanvas,
    private storageService: StorageService
  ) {
  }

  ngOnInit(): void {
    this.getAllInvoices();
  }

  ngAfterViewInit() {
    this.getAllInvoices();
  }



  getAllInvoices() {
    this.getInvoicesFromLocalStorage();
    if (this.invoices.length <= 0) {
      this.getAllInvoicesFromApi();
    }
  }

  getInvoicesFromLocalStorage() {
    this.invoices = this.storageService.getAllInvoices();
    console.log('Invoices From Storage ', this.invoices)
  }


  getAllInvoicesFromApi() {
    this.invoiceService.getAllInvoices().subscribe(data => {
      if (data.length > 0) {

        this.tempInvoicesArray = data;
        this.invoices = data;
        this.showInvoiceLengthMessage(data.length, 'total');
      } else {
        this.hasInvoices = true;

      }
    })
  }

  selectStatus(status: string) {
    this.isDropDownOpen = false;
    let stat = status.toLowerCase();
    this.showAllInvoices = stat !== 'total' ? true : false;
    this.invoices = stat === 'total' ? this.tempInvoicesArray : this.tempInvoicesArray.filter(invoice => invoice.status === stat);
    this.showInvoiceLengthMessage(this.invoices.length, stat);

  }

  changeDropDownArrow() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  openOffCanvas(content: any) {
    this.offcanvasService.open(content, { panelClass: 'off-canvas-width', animation: true });
    // offCanvasRef.componentInstance.title = "New Invoice";
  }

  private showInvoiceLengthMessage(total: number, stat: string) {
    if (total > 0) {
      this.totalInvoicesMessage = `${total} ${stat} invoices`;
    } else if (total <= 0 && stat != 'total') {
      this.totalInvoicesMessage = `no ${stat} invoices`;
    } else {
      this.totalInvoicesMessage = 'No invoices';
    }
  }

  getUpdateInvoices(event: any) {
    console.log('event', event)
    if (event) {
      this.getInvoicesFromLocalStorage()
    }
  }

}
