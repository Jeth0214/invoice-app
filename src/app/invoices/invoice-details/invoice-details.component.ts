import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Invoice } from '../invoice.model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {

  // no invoice div to add later
  showNoInvoice: boolean = false;
  invoice: any;

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
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

}
