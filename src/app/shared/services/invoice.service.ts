import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private url = 'api/invoices';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.url).pipe(
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
      tap(invoice => console.log(invoice)),
      catchError(this.errorHandler<Invoice>('addInvoice'))
    );
  }

  updateInvoice(invoice: Invoice): Observable<any> {
    return this.http.put(this.url, invoice, this.httpOptions).pipe(
      tap(_ => console.log(invoice)),
      catchError(this.errorHandler<any>('updateInvoice'))
    );
  }

  deleteInvoice(id: string): Observable<Invoice> {
    return this.http.delete<Invoice>(`${this.url}/${id}`, this.httpOptions).pipe(
      tap(_ => console.log('Delete Invoice', id)),
      catchError(this.errorHandler<Invoice>('deleteInvoice'))
    )
  }



  private errorHandler<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(operation, error);
      return of(result as T)
    }
  }


}
