import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Invoices } from '../invoice.model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss']
})
export class InvoicesListComponent implements OnInit {

  invoices: Invoices[] = [];
  totalInvoices: string = 'No invoices';
  status: string[] = ['Draft', 'Pending', 'Paid'];
  tempInvoicesArray: Invoices[] = [];

  statusForm = new FormGroup({
    status: new FormControl('', Validators.required)
  });

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.getAllInvoice();
  }

  getAllInvoice() {
    this.invoiceService.getAllInvoices().subscribe(data => {
      this.tempInvoicesArray = data;
      this.invoices = data;
      this.totalInvoices = `There are ${data.length} invoices`;
    })
  }

  selectStatus(status: string) {
    let stat = status.toLowerCase();
    this.invoices = this.tempInvoicesArray.filter(invoice => invoice.status === stat);
    this.totalInvoices = `There are ${this.invoices.length} ${stat} invoices`;
  }

}
