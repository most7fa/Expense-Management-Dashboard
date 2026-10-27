import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page').then(m => m.DashboardPage) },
      { path: 'expenses', loadComponent: () => import('./features/expenses/pages/expense-list-page/expense-list-page').then(m => m.ExpenseListPage) },
      { path: 'categories', loadComponent: () => import('./features/categories/pages/categories-page/categories-page').then(m => m.CategoriesPage) },
      { path: 'reports', loadComponent: () => import('./features/reports/pages/reports-page/reports-page').then(m => m.ReportsPage) },
      { path: 'settings', loadComponent: () => import('./features/settings/pages/settings-page/settings-page').then(m => m.SettingsPage) },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];
