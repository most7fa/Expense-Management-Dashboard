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
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/pages/categories-page/categories-page').then(m => m.CategoriesPageComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/pages/reports-page/reports-page').then(m => m.ReportsPageComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/pages/settings-page/settings-page').then(m => m.SettingsPageComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
