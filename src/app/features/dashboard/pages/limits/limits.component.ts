import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService, Transaction } from '../../../../core/services/transaction.service';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { AuthService } from '../../../../core/auth/auth.service';

interface LimitItem {
  categoryId: number;
  categoryName: string;
  icon: string;
  spent: number;
  limit: number;
  percentage: number;
}

@Component({
  selector: 'app-limits',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="limits-container">
      <header class="limits-header">
        <h1 class="limits-title">Controle de Metas</h1>
        <p class="limits-subtitle">Acompanhe seus gastos contra os limites definidos para cada categoria</p>
      </header>

      @if (isLoading) {
        <div class="loading-state">Carregando metas...</div>
      } @else {
        <div class="limits-list">
          @for (item of limitData; track item.categoryId) {
            <div class="limit-card">
              <div class="limit-main">
                <div class="cat-header">
                  <img [src]="item.icon" alt="icon" class="cat-icon" />
                  <h2 class="cat-name">{{ item.categoryName }}</h2>
                </div>

                <div class="tracker-info">
                  <p class="spent-text">Gasto atual: <strong>R$ {{ formatMoney(item.spent) }}</strong></p>
                  @if (item.limit > 0) {
                    @if (item.percentage <= 100) {
                      <p class="remaining-text">Disponível: R$ {{ formatMoney(item.limit - item.spent) }}</p>
                    } @else {
                      <p class="exceeded-text">Excedido: R$ {{ formatMoney(item.spent - item.limit) }}</p>
                    }
                  }
                </div>

                <div class="progress-track" [class.warning]="item.percentage > 85 && item.percentage <= 100" [class.danger]="item.percentage > 100">
                  <div class="progress-fill" [style.width.%]="item.percentage > 100 ? 100 : item.percentage"></div>
                </div>
              </div>

              <div class="limit-actions">
                @if (editingId === item.categoryId) {
                  <div class="edit-mode">
                    <label>Novo limite mensal</label>
                    <div class="input-wrapper">
                      <span class="currency">R$</span>
                      <input #limitInput type="number" [value]="item.limit" (keydown.enter)="saveLimit(item.categoryId, limitInput.value)" class="limit-input" autofocus />
                    </div>
                    <div class="action-buttons">
                      <button class="btn-cancel" (click)="cancelEdit()">Cancelar</button>
                      <button class="btn-save" (click)="saveLimit(item.categoryId, limitInput.value)">Salvar</button>
                    </div>
                  </div>
                } @else {
                  <div class="view-mode">
                    <div class="current-limit">
                      <span class="limit-label">Meta mensal definida</span>
                      <span class="limit-value">R$ {{ formatMoney(item.limit) }}</span>
                    </div>
                    <button class="btn-edit" (click)="startEdit(item.categoryId)">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Ajustar Limite
                    </button>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './limits.component.scss'
})
export class LimitsComponent implements OnInit {
  authService = inject(AuthService);
  transactionService = inject(TransactionService);
  categoryService = inject(CategoryService);
  cdr = inject(ChangeDetectorRef);

  transactions: Transaction[] = [];
  categories: Category[] = [];
  isLoading = true;
  limitData: LimitItem[] = [];
  editingId: number | null = null;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats.filter(c => c.type === "EXPENSE");
      this.loadTransactions();
    });
  }

  loadTransactions() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }
    this.transactionService.getTransactions(user.id).subscribe({
      next: (txs) => {
        this.transactions = txs.filter(t => t.type === 'EXPENSE');
        this.generateLimits();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  generateLimits() {
    const spentByCat = this.transactions.reduce((acc, t) => {
      acc[t.category.id] = (acc[t.category.id] || 0) + t.amount;
      return acc;
    }, {} as Record<number, number>);

    this.limitData = this.categories.map(cat => {
      const spent = spentByCat[cat.id] || 0;
      const limit = cat.monthlyLimit || 0;
      const percentage = limit > 0 ? (spent / limit) * 100 : (spent > 0 ? 100 : 0);

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        icon: cat.icon ? "/category-icon/" + cat.icon : "/category-icon/default-icon.svg",
        spent,
        limit,
        percentage
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }

  startEdit(categoryId: number) {
    this.editingId = categoryId;
  }

  cancelEdit() {
    this.editingId = null;
  }

  saveLimit(categoryId: number, newValue: string) {
    const parsed = parseFloat(newValue);
    if (!isNaN(parsed) && parsed >= 0) {
      this.categoryService.updateLimit(categoryId, parsed).subscribe({
        next: () => {
          this.editingId = null;
          this.loadData();
        },
        error: (err) => {
          console.error("Error saving limit", err);
          this.editingId = null;
        }
      });
    } else {
      this.editingId = null;
    }
  }

  formatMoney(value: number): string {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}





