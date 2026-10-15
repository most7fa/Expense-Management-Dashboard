import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExpenseService } from '../../../../core/services/expense.service';
import { Expense, DashboardSummary } from '../../../../core/models/expense.model';

// PrimeNG & PrimeIcons
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { TagSeverity } from 'primeng/types/tag';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    SelectModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.scss']
})
export class DashboardPageComponent implements OnInit {
  summary: DashboardSummary = {
    totalExpenses: 0,
    currentMonthExpenses: 0,
    previousMonthExpenses: 0,
    totalTransactions: 0,
    topCategory: null,
    expensesByCategory: [],
    expensesByMonth: []
  };

  recentExpenses: Expense[] = [];
  selectedDateRange = 'Apr 1, 2025 - Apr 30, 2025';
  dateRanges = [
    { label: 'Apr 1, 2025 - Apr 30, 2025', value: 'Apr 1, 2025 - Apr 30, 2025' },
    { label: 'Current Month', value: 'current' },
    { label: 'Last 30 Days', value: '30days' }
  ];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.expenseService.getDashboardSummary().subscribe(data => {
      this.summary = data;
    });

    this.expenseService.getExpenses({}).subscribe(expenses => {
      this.recentExpenses = expenses.slice(0, 5); // أحدث 5 مصروفات
    });
  }

  getCategorySeverity(category: string): TagSeverity {
    switch (category) {
      case 'Salaries': return 'success';
      case 'Rent': return 'warn';
      case 'Marketing': return 'info';
      case 'Utilities': return 'danger';
      default: return 'secondary';
    }
  }
}
