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

  getInvoice(id: string) {
    return this.invoices.filter(invoice => { return invoice.id === id })[0]
  }

  addInvoice(newInvoice: Invoice) {
    // console.log('add invoice to storage', newInvoice)
    this.invoices.push(newInvoice);
    return this.updateStorage();
  }

  updateInvoice(invoice: Invoice) {
    let index = this.findInvoiceIndex(invoice.id);
    // console.log(index);
    if (index < 0) {
      return;
    }
    this.invoices[index] = invoice;
    return this.updateStorage();
  }

  deleteInvoice(id: string) {
    this.invoices = this.invoices.filter(invoice => { return invoice.id !== id });
    return this.updateStorage();
  }

  private updateStorage() {
    // console.log('Updated invoices from storage', this.invoices)
    localStorage.setItem(STORAGENAME, JSON.stringify(this.invoices));
    return this.invoices
  }

  private findInvoiceIndex(id: string) {
    return this.invoices.findIndex(invoice => invoice.id === id);
  }
}
