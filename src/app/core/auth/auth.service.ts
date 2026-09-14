import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // TODO: Replace with real HTTP call
  login(email: string, password: string): Observable<{token: string, user: any}> {
    return of({
      token: 'fake-jwt-token-12345',
      user: {
        name: 'Usuário Teste',
        email: email
      }
    }).pipe(delay(1500));
  }
  
  logout() {
    // TODO: clear tokens, etc.
  }
}
