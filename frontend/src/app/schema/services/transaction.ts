import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'https://budget-tracker-angular-fastapi.onrender.com/transactions';
  //private apiUrl = 'http://127.0.0.1:8000/transactions'; // Local FastAPI backend URL

  constructor(private http: HttpClient) {}

    // getTransactions(): Observable<Transaction[]> {
    //   return this.http.get<Transaction[]>(this.apiUrl);
    // }

  getTransactions(startDate?: string, endDate?: string): Observable<Transaction[]> {
  let params = new HttpParams();
  if (startDate) params = params.set('start_date', startDate);
  if (endDate) params = params.set('end_date', endDate);

  return this.http.get<Transaction[]>(this.apiUrl, { params });
  }
  
  getTransaction(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
