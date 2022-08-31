import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Invoices } from '../invoice.model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss']
})
export class InvoicesListComponent implements OnInit {

  invoices: Invoices[] = [];
  totalInvoicesMessage: string = 'No invoices';
  status: string[] = ['Draft', 'Pending', 'Paid'];
  tempInvoicesArray: Invoices[] = [];
  showAllInvoices: boolean = false;

  statusForm = new FormGroup({
    status: new FormControl('', Validators.required)
  });

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.getAllInvoice();
  }

  getAllInvoice() {
    this.totalInvoicesMessage = "Fetching invoices ...."
    this.invoiceService.getAllInvoices().subscribe(data => {
      if (data.length > 0) {

        this.tempInvoicesArray = data;
        this.invoices = data;
        this.showInvoiceLengthMessage(data.length, 'total')
      }
    })
  }

  selectStatus(status: string) {
    let stat = status.toLowerCase();
    this.showAllInvoices = stat !== 'total' ? true : false;
    this.invoices = stat === 'total' ? this.tempInvoicesArray : this.tempInvoicesArray.filter(invoice => invoice.status === stat);
    this.showInvoiceLengthMessage(this.invoices.length, stat);

  }

  private showInvoiceLengthMessage(total: number, stat: string) {
    console.log(total);
    console.log(stat)
    if (total > 0) {
      this.totalInvoicesMessage = `There are ${total} ${stat} invoices`;
    } else if (total <= 0 && stat != 'total') {
      this.totalInvoicesMessage = `There are no ${stat} invoices`;
    } else {
      this.totalInvoicesMessage = 'No invoices';
    }
  }

}
