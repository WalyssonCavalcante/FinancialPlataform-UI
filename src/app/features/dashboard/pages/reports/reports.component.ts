import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService, Transaction } from '../../../../core/services/transaction.service';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { AuthService } from '../../../../core/auth/auth.service';

interface CategoryReport {
  categoryName: string;
  amount: number;
  percentage: number;
  icon: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="report-container">
      <header class="report-header">
        <h1 class="report-title">Para onde foi seu dinheiro?</h1>
        <p class="report-subtitle">Resumo de gastos do mês atual</p>
      </header>

      @if (isLoading) {
        <div class="loading-state">Calculando relatório...</div>
      } @else if (reportData.length === 0) {
        <div class="empty-state">
          Nenhum gasto registrado para gerar relatório.
        </div>
      } @else {
        <div class="report-narrative">
          <h2>Seu maior gasto foi com <strong>{{ reportData[0].categoryName }}</strong>, representando <strong>{{ reportData[0].percentage | number:'1.0-0' }}%</strong> do total.</h2>
        </div>

        <div class="bars-container">
          @for (item of reportData; track item.categoryName) {
            <div class="bar-row">
              <div class="bar-label">
                <img [src]="item.icon" alt="icon" class="bar-icon" />
                <span class="name">{{ item.categoryName }}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" [style.width.%]="item.percentage"></div>
              </div>
              <div class="bar-value">
                R$ {{ formatMoney(item.amount) }}
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  authService = inject(AuthService);
  transactionService = inject(TransactionService);
  categoryService = inject(CategoryService);
  cdr = inject(ChangeDetectorRef);

  transactions: Transaction[] = [];
  categories: Category[] = [];
  isLoading = true;
  reportData: CategoryReport[] = [];

  ngOnInit() {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
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
        this.transactions = txs;
        this.generateReport();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  generateReport() {
    const expenses = this.transactions.filter(t => t.type === 'EXPENSE');
    const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);

    if (totalExpense === 0) {
      this.reportData = [];
      return;
    }

    const grouped = expenses.reduce((acc, t) => {
      acc[t.category.id] = (acc[t.category.id] || 0) + t.amount;
      return acc;
    }, {} as Record<number, number>);

    this.reportData = Object.keys(grouped).map(catIdStr => {
      const id = parseInt(catIdStr, 10);
      const cat = this.categories.find(c => c.id === id);
      const amount = grouped[id];
      return {
        categoryName: cat ? cat.name : 'Outros',
        amount: amount,
        percentage: (amount / totalExpense) * 100,
        icon: cat?.icon ? '/category-icon/' + cat.icon : '/category-icon/default-icon.svg'
      };
    }).sort((a, b) => b.amount - a.amount);
  }

  formatMoney(value: number): string {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
