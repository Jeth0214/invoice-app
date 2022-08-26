import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';



@NgModule({
  declarations: [
    InvoicesListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InvoicesListComponent
  ]
})
export class InvoicesModule { }
