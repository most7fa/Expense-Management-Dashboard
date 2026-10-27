import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { ExpenseService } from '../../../../core/services/expense.service';
import { DashboardStats } from '../../../../core/models/expense.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ChartModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  loading = true;
  error = '';
  monthlyData: any;
  categoryData: any;
  chartOptions: any;
  doughnutOptions: any;
  private subscription?: Subscription;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#64748b', usePointStyle: true, padding: 18 } } },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { color: '#64748b' }, grid: { color: '#eef2f7' } }
      }
    };
    this.doughnutOptions = {
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14 } } }
    };
    this.subscription = forkJoin({
      stats: this.expenseService.getDashboardStats(),
      monthly: this.expenseService.getMonthlyChartData(),
      categories: this.expenseService.getCategoryChartData()
    }).subscribe({
      next: result => {
        this.stats = result.stats;
        this.monthlyData = { labels: result.monthly.labels, datasets: [{ label: 'Expenses', data: result.monthly.values, backgroundColor: '#6478f5', borderRadius: 7 }] };
        this.categoryData = { labels: result.categories.labels, datasets: [{ data: result.categories.values, backgroundColor: ['#6478f5', '#31b7a2', '#f5b544', '#ed7890', '#8d75dc', '#5aafdc', '#a7b1c2'], hoverOffset: 5 }] };
        this.loading = false;
      },
      error: () => { this.error = 'Could not load dashboard data.'; this.loading = false; }
    });
  }

  ngOnDestroy(): void { this.subscription?.unsubscribe(); }
}
