import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  account: { id: number; name: string };
  category: { id: number; name: string; icon: string; color: string; };
}

export interface TransactionRequestDTO {
  accountId: number;
  categoryId: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/transactions`;

  getTransactions(userId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}?userId=${userId}`);
  }

  createTransaction(dto: TransactionRequestDTO, userId: number): Observable<Transaction> {
    const payload = { ...dto, userId };
    return this.http.post<Transaction>(this.apiUrl, payload);
  }
}
