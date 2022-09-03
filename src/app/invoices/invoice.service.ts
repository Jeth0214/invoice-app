import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Invoice } from './invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private url = 'api/invoices';

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


  private errorHandler<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(operation, error);
      return of(result as T)
    }
  }
}
