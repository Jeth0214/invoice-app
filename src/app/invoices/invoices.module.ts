import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbDatepicker, NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { RouterModule } from '@angular/router';
import { AddEditInvoicesComponent } from './add-edit-invoices/add-edit-invoices.component';
import { ComponentsModule } from '../components/components.module';
import { NgxPrintModule } from 'ngx-print';



@NgModule({
  declarations: [
    InvoicesListComponent,
    InvoiceDetailsComponent,
    AddEditInvoicesComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule,
    ComponentsModule,
    HttpClientModule,
    NgxPrintModule
  ],
  exports: [
    InvoicesListComponent,
    InvoiceDetailsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InvoicesModule { }
