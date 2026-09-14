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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
