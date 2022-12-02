import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Invoice } from './invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  // token = ' eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJrZGFtb3JhIiwianRpIjoiOTI0NTU3OGYtZmNmOC00NDgxLWFiMjItNGJlZTkyZWE1ODlkIiwiZW1haWwiOiJrZGFtb3JhQGdtYWlsLmNvbSIsInVpZCI6ImE3ZWM3MzZiLTk1ZTYtNDRiYS1iY2FmLWEwZjM1ZDZjYWNkMSIsInJvbGVzIjoiQWRtaW5pc3RyYXRvciIsImV4cCI6MTY2MjU3NDY0OSwiaXNzIjoiUHJvamVjdCA0U2lnaHQiLCJhdWQiOiJDaGlsZCBWaXNpb24ifQ.PrLZwM4liCMfnwAhrQyaZyMdSYBngp9011ubPzPC0to';
  private url = 'api/invoices';

  constructor(private http: HttpClient) { }

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.url).pipe(
      catchError(this.errorHandler<Invoice[]>('getAllInvoices', []))
    );
  }

  // getAllUsers(): Observable<any> {
  //   let header = new HttpHeaders().set(
  //     "Authorization",
  //     this.token
  //   );
  //   return this.http.get<any>('https://localhost:5003/api/Admin/GetAllUsers', { headers: header })
  // }

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
