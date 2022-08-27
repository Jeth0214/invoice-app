import { Component, OnInit } from '@angular/core';
import { Invoices } from '../invoice.model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss']
})
export class InvoicesListComponent implements OnInit {

  invoices: Invoices[] = []
  totalInvoices: string = 'No invoices'

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.invoiceService.getAllInvoices().subscribe(data => {
      this.invoices = data;
      this.totalInvoices = `There are ${data.length} invoices`
    })

  }

}
