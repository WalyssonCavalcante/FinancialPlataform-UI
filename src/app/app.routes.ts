import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginPageComponent),
    data: { animation: 'LoginPage' }
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterPageComponent),
    data: { animation: 'RegisterPage' }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/pages/home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/dashboard/pages/transactions/transactions.component').then(m => m.TransactionsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/dashboard/pages/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'limits',
        loadComponent: () => import('./features/dashboard/pages/limits/limits.component').then(m => m.LimitsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/dashboard/pages/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

