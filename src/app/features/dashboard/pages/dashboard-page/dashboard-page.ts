import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ExpenseService } from '../../../../core/services/expense.service';
import { DashboardSummary } from '../../../../core/models/expense.model';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, ChartModule, ProgressSpinnerModule, CurrencyPipe],
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.scss']
})
export class DashboardPageComponent implements OnInit {
  summaryData: DashboardSummary | null = null;
  isLoading = true;

  // Chart configurations
  monthlyChartData: any;
  monthlyChartOptions: any;
  categoryChartData: any;
  categoryChartOptions: any;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.expenseService.getDashboardSummary().subscribe({
      next: (summary) => {
        this.summaryData = summary;
        this.initCharts(summary);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.isLoading = false;
      }
    });
  }

  private initCharts(summary: DashboardSummary): void {
    const textColor = '#495057';
    const textColorSecondary = '#6c757d';
    const surfaceBorder = '#dfe7ef';

    // 1. Monthly Bar Chart
    const monthLabels = summary.expensesByMonth.map(item => item.month);
    const monthAmounts = summary.expensesByMonth.map(item => item.amount);

    this.monthlyChartData = {
      labels: monthLabels,
      datasets: [
        {
          label: 'Expenses ($)',
          backgroundColor: '#3B82F6',
          borderColor: '#3B82F6',
          data: monthAmounts,
          borderRadius: 6
        }
      ]
    };

    this.monthlyChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false }
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false }
        }
      }
    };

    // 2. Category Pie/Doughnut Chart
    const categoryLabels = summary.expensesByCategory.map(item => item.category);
    const categoryAmounts = summary.expensesByCategory.map(item => item.amount);

    this.categoryChartData = {
      labels: categoryLabels,
      datasets: [
        {
          data: categoryAmounts,
          backgroundColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6',
            '#EC4899',
            '#6B7280'
          ]
        }
      ]
    };

    this.categoryChartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, usePointStyle: true }
        }
      },
      maintainAspectRatio: false
    };
  }
}
