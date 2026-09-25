import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/layout/sidebar/sidebar.component';
import { TransactionService } from '../../core/services/transaction.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="dashboard-shell">
      <app-sidebar></app-sidebar>
      <div class="main-wrapper">
        <header class="top-header" *ngIf="!isDashboardHome()">
          <div class="header-spacer"></div>
          <div class="balance-pill" [class.loading]="isLoading">
            <div class="balance-info">
              <span class="balance-label">Saldo Atual</span>
              <span class="balance-value">R$ {{ formatMoney(balance) }}</span>
            </div>
            <div class="balance-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M7 15h0M2 9.5h20"></path>
              </svg>
            </div>
          </div>
        </header>
        <main class="dashboard-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent implements OnInit {
  authService = inject(AuthService);
  transactionService = inject(TransactionService);
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);

  balance: number = 0;
  isLoading: boolean = true;

  ngOnInit() {
    this.loadBalance();
    
    // Refresh balance on navigation to ensure it's up to date
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadBalance();
    });
  }

  loadBalance() {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    
    this.isLoading = true;
    this.transactionService.getTransactions(user.id).subscribe({
      next: (txs) => {
        const totalIncome = txs.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
        const totalExpense = txs.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
        this.balance = totalIncome - totalExpense;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatMoney(value: number): string {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  isDashboardHome(): boolean {
    // The main dashboard route is just '/dashboard'
    return this.router.url === '/dashboard';
  }
}
