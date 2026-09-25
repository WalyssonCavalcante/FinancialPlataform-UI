import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export interface UserCreated {
  id: number;
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  register(name: string, email: string, password: string): Observable<UserCreated> {
    return this.http.post<UserCreated>(this.apiUrl, { name, email, password });
  }

  login(email: string, password: string): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(user => localStorage.setItem('currentUser', JSON.stringify(user)))
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): UserResponse | null {
    const userStr = localStorage.getItem("currentUser") || localStorage.getItem("finly-user");
    return userStr ? JSON.parse(userStr) : null;
  }

  updateUser(id: number, data: { name?: string; password?: string }): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, data).pipe(
      tap(user => {
        // update local storage
        if (localStorage.getItem("currentUser")) localStorage.setItem("currentUser", JSON.stringify(user));
        if (localStorage.getItem("finly-user")) localStorage.setItem("finly-user", JSON.stringify(user));
      })
    );
  }
}

