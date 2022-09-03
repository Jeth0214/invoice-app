import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    InvoicesListComponent,
    InvoiceDetailsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule
  ],
  exports: [
    InvoicesListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InvoicesModule { }
