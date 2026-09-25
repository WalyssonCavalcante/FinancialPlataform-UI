import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { TransactionService, Transaction } from '../../../../core/services/transaction.service';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { TransactionModalComponent } from '../../components/transaction-modal/transaction-modal.component';

registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, TransactionModalComponent],
  providers: [DatePipe],
  template: `
    <div class="ledger-container">
      <header class="ledger-header">
        <div class="header-left">
          <h1 class="ledger-title">Lançamentos</h1>
          <p class="ledger-subtitle">Histórico financeiro detalhado</p>
        </div>
        
        <div class="header-right">
          <button class="btn-action" (click)="openModal('EXPENSE')">
            <span>-</span> Nova Saída
          </button>
          <button class="btn-action primary" (click)="openModal('INCOME')">
            <span>+</span> Nova Entrada
          </button>
        </div>
      </header>

      <section class="ledger-controls">
        <div class="filters">
          <button class="filter-btn active">Neste Mês</button>
          <button class="filter-btn">Últimos 30 dias</button>
          <button class="filter-btn">Este Ano</button>
        </div>
      </section>

      <main class="ledger-list">
        <div class="ledger-row header-row">
          <div class="col-date">Data</div>
          <div class="col-desc">Descrição</div>
          <div class="col-cat">Categoria</div>
          <div class="col-val">Valor</div>
        </div>

        @if (isLoading) {
          <div class="loading-state">Carregando lançamentos...</div>
        } @else if (transactions.length === 0) {
          <div class="empty-state">
            <p>Nenhum lançamento encontrado neste período.</p>
          </div>
        } @else {
          @for (tx of transactions; track tx.id) {
            <div class="ledger-row data-row">
              <div class="col-date">{{ tx.date | date:'dd MMM':'':'pt-BR' }}</div>
              <div class="col-desc">{{ tx.description }}</div>
              <div class="col-cat">
                <span class="cat-pill">
                  <img [src]="getCategoryIcon(tx.category.id)" class="cat-icon-mini" alt="icon"/>
                  {{ getCategoryName(tx.category.id) }}
                </span>
              </div>
              <div class="col-val" [class.positive]="tx.type === 'INCOME'" [class.negative]="tx.type === 'EXPENSE'">
                <span class="mono">{{ tx.type === 'INCOME' ? '+' : '-' }} R$ {{ formatMoney(tx.amount) }}</span>
              </div>
            </div>
          }
        }
      </main>

      <!-- Modal -->
      <app-transaction-modal
        *ngIf="showModal"
        [type]="modalType"
        (close)="closeModal()"
        (transactionSaved)="onTransactionSaved()">
      </app-transaction-modal>
    </div>
  `,
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  authService = inject(AuthService);
  transactionService = inject(TransactionService);
  categoryService = inject(CategoryService);
  cdr = inject(ChangeDetectorRef);

  transactions: Transaction[] = [];
  categories: Category[] = [];
  isLoading = true;

  showModal = false;
  modalType: 'INCOME' | 'EXPENSE' = 'EXPENSE';

  ngOnInit() {
    this.loadCategories();
    this.loadTransactions();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  loadTransactions() {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();
    if (user) {
      this.transactionService.getTransactions(user.id).subscribe({
        next: (txs) => {
          this.transactions = txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  getCategoryName(id: number): string {
    const cat = this.categories.find(c => c.id === id);
    return cat ? cat.name : 'Outros';
  }

  getCategoryIcon(id: number): string {
    const cat = this.categories.find(c => c.id === id);
    return cat?.icon ? '/category-icon/' + cat.icon : '/category-icon/default-icon.svg';
  }

  formatMoney(value: number): string {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  openModal(type: 'INCOME' | 'EXPENSE') {
    this.modalType = type;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onTransactionSaved() {
    this.showModal = false;
    this.loadTransactions();
  }
}
