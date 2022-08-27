import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    InvoicesListComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    InvoicesListComponent
  ]
})
export class InvoicesModule { }
