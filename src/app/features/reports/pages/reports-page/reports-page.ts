import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { ExpenseService } from '../../../../core/services/expense.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ChartModule],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.scss'
})
export class ReportsPage implements OnInit {
  loading = true;
  monthlyData: ChartData<'bar'> | null = null;
  categoryData: ChartData<'doughnut'> | null = null;
  total = 0;
  readonly options: ChartOptions = { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } } } };
  constructor(private service: ExpenseService) {}
  ngOnInit(): void {
    this.service.getMonthlyChartData().subscribe(data => this.monthlyData = { labels: data.labels, datasets: [{ label: 'Expenses', data: data.values, backgroundColor: '#6478f5', borderRadius: 7 }] });
    this.service.getCategoryChartData().subscribe(data => { this.categoryData = { labels: data.labels, datasets: [{ label: 'Expenses', data: data.values, backgroundColor: ['#6478f5', '#31b7a2', '#f5b544', '#ed7890', '#8d75dc', '#5aafdc', '#a7b1c2'] }] }; this.total = data.values.reduce((a, b) => a + b, 0); this.loading = false; });
  }
}
