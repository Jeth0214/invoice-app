import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Invoices } from './invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private url = 'api/invoices';

  constructor(private http: HttpClient) { }

  getAllInvoices(): Observable<Invoices[]> {
    return this.http.get<Invoices[]>(this.url).pipe(
      catchError(this.errorHandler<Invoices[]>('getAllInvoices', []))
    );
  }


  private errorHandler<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(operation, error);
      return of(result as T)
    }
  }
}
