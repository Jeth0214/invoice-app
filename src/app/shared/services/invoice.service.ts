import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Invoice } from '../models/invoice.model';
import { StorageService } from './storage.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private url = 'api/invoices';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-type': 'application/json' })
  };

  constructor(private http: HttpClient, private storageService: StorageService, private toasterService: ToastrService) { }

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.url).pipe(
      tap((invoices: Invoice[]) => {
        // console.log('All invoices From api', invoices);
        this.storageService.getAllInvoiceFromApiToStore(invoices);
      }),
      catchError(this.errorHandler<Invoice[]>('getAllInvoices', []))
    );
  }

  getInvoice(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.url}/${id}`).pipe(
      catchError(this.errorHandler<Invoice>(`getInvoice id=${id}`))
    );
  }

  addInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.url, invoice, this.httpOptions).pipe(
      tap(invoice => {
        // console.log('Added invoice', invoice);
        this.storageService.addInvoice(invoice);
        this.toasterService.success("Successfully added invoice!");
      }),
      catchError(this.errorHandler<Invoice>('Adding this invoice'))
    );
  }

  updateInvoice(invoice: Invoice): Observable<any> {
    return this.http.put(this.url, invoice, this.httpOptions).pipe(
      tap(_ => {
         console.log('Updated Invoice', invoice);
        this.storageService.updateInvoice(invoice);
        this.toasterService.success(`Successfully updated invoice #${invoice.id}!`);
        return invoice;
      }),
      catchError(this.errorHandler<any>('Updating this invoice'))
    );
  }

  deleteInvoice(id: string): Observable<Invoice> {
    return this.http.delete<Invoice>(`${this.url}/${id}`, this.httpOptions).pipe(
      tap(__ => {
        // console.log('Delete Invoice', id);
        this.storageService.deleteInvoice(id);
        this.toasterService.success(`Successfully deleted invoice #${id}!`);
      }),
      catchError(this.errorHandler<Invoice>('Deleting this invoice'))
    )
  }



  private errorHandler<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.toasterService.error(`${operation} failed, error: ${error.message}`);
      console.log(operation, error);
      return of(result as T)
    }
  }


}
