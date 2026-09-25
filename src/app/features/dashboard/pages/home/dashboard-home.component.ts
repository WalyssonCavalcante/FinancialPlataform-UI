import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService, Account } from '../../../../core/services/account.service';
import { TransactionService, Transaction } from '../../../../core/services/transaction.service';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { TransactionModalComponent } from '../../components/transaction-modal/transaction-modal.component';
import { ToastService } from '../../../../shared/components/toast/toast.component';
import { AuthService } from '../../../../core/auth/auth.service';

interface CategoryItem {
  name: string;
  percentage: number;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, TransactionModalComponent],
  template: `
    <div class="dashboard-home">

      <!-- Top Bar: Greeting + Period Filters -->
      <section class="top-bar">
        <h1 class="greeting">Olá, {{ userName }}!</h1>
        <div class="period-filters">
          @for (period of periods; track period) {
            <button
              class="period-btn"
              [class.active]="selectedPeriod === period"
              (click)="selectedPeriod = period">
              {{ period }}
            </button>
          }
        </div>
      </section>

      <!-- Summary Cards -->
      <section class="summary-row">
        <div class="summary-card">
          <span class="card-label">Saldo</span>
          <div class="card-value-row">
            <span class="card-value">R$ {{ account ? formatMoney(account.balance) : '0,00' }}</span>
            <span class="card-badge positive">+ 0,0%</span>
          </div>
        </div>
        <div class="summary-card">
          <span class="card-label">Receitas</span>
          <div class="card-value-row">
            <span class="card-value">R$ {{ formatMoney(totalIncome) }}</span>
            <span class="card-badge positive">+ 0%</span>
          </div>
        </div>
        <div class="summary-card">
          <span class="card-label">Despesas</span>
          <div class="card-value-row">
            <span class="card-value">R$ {{ formatMoney(totalExpense) }}</span>
            <span class="card-badge negative">- 0%</span>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="actions-row">
        <button class="action-card" (click)="openModal('INCOME')">
          <span class="action-icon income-icon">
            <img src="/add.svg" alt="Add" class="svg-img" />
          </span>
          <div class="action-text">
            <span class="action-title">Adicionar receita</span>
            <span class="action-desc">Registre uma receita manualmente</span>
          </div>
        </button>
        <button class="action-card" (click)="openModal('EXPENSE')">
          <span class="action-icon expense-icon">
            <img src="/minus.svg" alt="Minus" class="svg-img" />
          </span>
          <div class="action-text">
            <span class="action-title">Adicionar despesa</span>
            <span class="action-desc">Registre uma despesa manualmente</span>
          </div>
        </button>
      </section>

      <!-- Bottom Grid: Categories + Transactions -->
      <section class="bottom-grid">

        <!-- Expenses by Category -->
        <div class="categories-card">
          <h2>Despesas por categoria</h2>

          <div class="donut-container">
            <svg viewBox="0 0 36 36" class="donut-chart">
              @for (seg of donutSegments; track seg.color) {
                <circle
                  class="donut-segment"
                  cx="18" cy="18" r="15.9155"
                  fill="none"
                  [attr.stroke]="seg.color"
                  stroke-width="3.5"
                  [attr.stroke-dasharray]="seg.dashArray"
                  [attr.stroke-dashoffset]="seg.offset"
                />
              }
            </svg>
          </div>

          <div class="category-list">
            @for (cat of categories; track cat.name) {
              <div class="category-item">
                <img [src]="'/category-icon/' + cat.icon" [alt]="cat.name" class="cat-icon-img" />
                <span class="cat-name">{{ cat.name }}</span>
                <span class="cat-pct">{{ cat.percentage }}%</span>
              </div>
            }
          </div>
        </div>

        <!-- Last Transactions -->
        <div class="transactions-card">
          <div class="tx-header">
            <div>
              <h2>Ultimas transacoes</h2>
              <p class="tx-subtitle">Confira suas ultimas transacoes</p>
            </div>
          </div>

          <table class="tx-table">
            <thead>
              <tr>
                <th>Descricao</th>
                <th>Metodo</th>
                <th>Data</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @if (isLoading) {
                <!-- Skeleton rows -->
                @for (i of [1, 2, 3]; track i) {
                  <tr class="skeleton-row">
                    <td class="tx-desc-cell">
                      <div class="skeleton skeleton-icon"></div>
                      <div class="skeleton skeleton-text" style="width: 120px; margin: 0;"></div>
                    </td>
                    <td><div class="skeleton skeleton-text" style="width: 80px;"></div></td>
                    <td><div class="skeleton skeleton-text" style="width: 90px;"></div></td>
                    <td><div class="skeleton skeleton-text" style="width: 70px;"></div></td>
                    <td><div class="skeleton skeleton-icon" style="width: 16px; height: 16px;"></div></td>
                  </tr>
                }
              } @else {
                @if (transactions.length === 0) {
                  <tr>
                    <td colspan="5" class="empty-state">Nenhuma transação registrada ainda.</td>
                  </tr>
                }
                @for (tx of transactions; track tx.id) {
                  <tr>
                    <td class="tx-desc-cell">
                      <img [src]="'/category-icon/' + (tx.category?.icon || 'default-icon.svg')" [alt]="tx.category?.name" class="tx-cat-icon" />
                      {{ tx.description }}
                    </td>
                    <td class="tx-method">{{ tx.category?.name || 'Sem categoria' }}</td>
                    <td class="tx-date">{{ tx.date | date:'dd/MM/yyyy' }}</td>
                    <td [class]="tx.type === 'INCOME' ? 'tx-amount-positive' : 'tx-amount-negative'">
                      {{ tx.type === 'INCOME' ? '+' : '-' }}R$ {{ formatMoney(tx.amount) }}
                    </td>
                    <td class="tx-actions">
                      <button class="tx-menu-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                      </button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </section>

      @if (showModal && account) {
        <app-transaction-modal 
          [type]="modalType"
          [accountId]="account.id"
          (close)="showModal = false"
          (saved)="onTransactionSaved()">
        </app-transaction-modal>
      }

    </div>
  `,
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  periods = ['Este mes', 'Mes passado', 'Este ano', 'Ultimos 12 meses'];
  selectedPeriod = 'Este mes';

  categories: CategoryItem[] = [];

  get donutSegments() {
    const circumference = 100;
    let accumulated = 0;
    return this.categories.map(cat => {
      const segment = {
        color: cat.color,
        dashArray: `${cat.percentage} ${circumference - cat.percentage}`,
        offset: `${-accumulated + 25}`,
      };
      accumulated += cat.percentage;
      return segment;
    });
  }

  accountService = inject(AccountService);
  transactionService = inject(TransactionService);
  categoryService = inject(CategoryService);
  toastService = inject(ToastService);

  account: Account | null = null;
  transactions: Transaction[] = [];
  categoriesData: Category[] = [];

  totalIncome = 0;
  totalExpense = 0;

  showModal = false;
  modalType: 'INCOME' | 'EXPENSE' = 'INCOME';
  isLoading = true;

  userName = '';

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && user.name) {
      this.userName = user.name;
    } else {
      this.userName = 'Visitante';
    }
    this.loadAccount();
    this.loadTransactions();
  }

  openModal(type: 'INCOME' | 'EXPENSE') {
    if (!this.account) {
      this.toastService.error('Erro de conexão: Conta não carregada. Verifique o backend.');
      return;
    }
    this.modalType = type;
    this.showModal = true;
  }

  onTransactionSaved() {
    this.showModal = false;
    this.loadTransactions(); // Recarrega os dados após salvar
  }

  authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  loadTransactions() {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();
    const userId = user ? user.id : 0;
    
    this.transactionService.getTransactions(userId).subscribe({
      next: (txs: Transaction[]) => {
        this.transactions = txs;
        this.calculateTotals();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao carregar transações', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateTotals() {
    this.totalIncome = this.transactions
      .filter(tx => tx.type === 'INCOME')
      .reduce((sum, tx) => sum + tx.amount, 0);

    this.totalExpense = this.transactions
      .filter(tx => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate category percentages
    if (this.totalExpense > 0) {
      const expensesByCategory = new Map<string, { amount: number, color: string, icon: string }>();
      
      this.transactions.filter(tx => tx.type === 'EXPENSE').forEach(tx => {
        const catName = tx.category?.name || 'Outros';
        const color = tx.category?.color || '#9ca3af';
        const icon = tx.category?.icon || 'default-icon.svg';
        
        const existing = expensesByCategory.get(catName);
        if (existing) {
          existing.amount += tx.amount;
        } else {
          expensesByCategory.set(catName, { amount: tx.amount, color, icon });
        }
      });

      this.categories = Array.from(expensesByCategory.entries())
        .map(([name, data]) => ({
          name,
          percentage: Number(((data.amount / this.totalExpense) * 100).toFixed(2)),
          color: data.color,
          icon: data.icon
        }))
        .sort((a, b) => b.percentage - a.percentage);
    } else {
      this.categories = [];
    }
  }

  loadAccount() {
    const user = this.authService.getCurrentUser();
    const userId = user ? user.id : 0;
    
    this.accountService.getAccounts(userId).subscribe({
      next: (accounts: Account[]) => {
        if (accounts && accounts.length > 0) {
          this.account = accounts[0];
        } else {
          // If no account exists, create a default one
          this.accountService.createAccount('Conta Principal', userId).subscribe({
            next: (newAccount: Account) => {
              this.account = newAccount;
            }
          });
        }
      },
      error: (err: any) => console.error('Erro ao carregar contas', err)
    });
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  formatMoney(value: number): string {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }
}
