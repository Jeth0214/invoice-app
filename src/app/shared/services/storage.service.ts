import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice.model';

const STORAGENAME = 'invoices';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private invoices: Invoice[] = [];

  constructor() {
    this.invoices = JSON.parse(localStorage.getItem(STORAGENAME) as string) || [];
  }

  getAllInvoiceFromApiToStore(invoices: Invoice[]) {
    this.invoices = invoices;
    localStorage.setItem(STORAGENAME, JSON.stringify(this.invoices));
  }

  getAllInvoices() {
    return [...this.invoices]
  }

  addInvoice(newInvoice: Invoice) {
    console.log('add invoice to storage', newInvoice)
    this.invoices.push(newInvoice);
    return this.updateStorage();
  }

  deleteInvoice(id: string) {
    this.invoices = this.invoices.filter(invoice => { return invoice.id !== id });
    return this.updateStorage();
  }

  private updateStorage() {
    console.log('Updated invoices from storage', this.invoices)
    localStorage.setItem(STORAGENAME, JSON.stringify(this.invoices));
    return this.invoices
  }
}
