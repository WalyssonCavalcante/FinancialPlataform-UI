import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Account {
  id: number;
  name: string;
  balance: number;
  type: string;
  overdraftLimit?: number;
}

export interface AccountRequestDTO {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/accounts`;

  getAccounts(userId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}?userId=${userId}`);
  }

  createAccount(name: string, userId: number): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, { name, userId });
  }
}
