import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: 'INCOME' | 'EXPENSE';
  monthlyLimit?: number;
}

export interface CategoryRequestDTO {
  name: string;
  icon: string;
  color: string;
  type: 'INCOME' | 'EXPENSE';
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categories`;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  createCategory(name: string, type: 'INCOME' | 'EXPENSE'): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, { name, type });
  }

  updateLimit(id: number, limit: number): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}/limit`, { limit });
  }
}
