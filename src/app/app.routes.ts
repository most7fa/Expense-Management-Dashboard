import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page').then(m => m.DashboardPageComponent)
      },
      {
        path: 'expenses',
        loadComponent: () => import('./features/expenses/pages/expense-list-page/expense-list-page').then(m => m.ExpenseListPageComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
