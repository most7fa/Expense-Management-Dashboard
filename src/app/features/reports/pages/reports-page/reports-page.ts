import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TagSeverity } from 'primeng/types/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

export interface ReportItem {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  status: 'Approved' | 'Pending' | 'Flagged';
}

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    TagModule,
    ToastModule,
    CurrencyPipe,
    DatePipe
  ],
  providers: [MessageService],
  templateUrl: './reports-page.html'
})
export class ReportsPageComponent implements OnInit {
  selectedReportType = 'monthly';
  reportTypes = [
    { label: 'Monthly Summary Report', value: 'monthly' },
    { label: 'Tax & Compliance Audit', value: 'tax' },
    { label: 'Category Breakdown Report', value: 'category' }
  ];

  selectedCategory = 'All';
  categories = [
    { label: 'All Categories', value: 'All' },
    { label: 'Rent', value: 'Rent' },
    { label: 'Salaries', value: 'Salaries' },
    { label: 'Utilities', value: 'Utilities' },
    { label: 'Transportation', value: 'Transportation' },
    { label: 'Marketing', value: 'Marketing' }
  ];

  reportData: ReportItem[] = [
    { id: 'EXP-101', date: '2025-04-01', category: 'Rent', description: 'Office Lease - Q2', amount: 2500, paymentMethod: 'Bank Transfer', status: 'Approved' },
    { id: 'EXP-102', date: '2025-04-03', category: 'Salaries', description: 'Engineering Team Payroll', amount: 1520, paymentMethod: 'Direct Deposit', status: 'Approved' },
    { id: 'EXP-103', date: '2025-04-05', category: 'Utilities', description: 'High-speed Fiber Internet', amount: 1010, paymentMethod: 'Credit Card', status: 'Approved' },
    { id: 'EXP-104', date: '2025-04-10', category: 'Transportation', description: 'Corporate Logistics & Fuel', amount: 850, paymentMethod: 'Corporate Card', status: 'Approved' },
    { id: 'EXP-105', date: '2025-04-12', category: 'Marketing', description: 'Google Ads Campaign', amount: 590, paymentMethod: 'Credit Card', status: 'Pending' },
    { id: 'EXP-106', date: '2025-04-14', category: 'Office Supplies', description: 'Ergonomic Desk Accessories', amount: 680, paymentMethod: 'Cash', status: 'Approved' }
  ];

  filteredData: ReportItem[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.filteredData = [...this.reportData];
  }

  get totalReportAmount(): number {
    return this.filteredData.reduce((sum, item) => sum + item.amount, 0);
  }

  get approvedCount(): number {
    return this.filteredData.filter(i => i.status === 'Approved').length;
  }

  filterReports(): void {
    if (this.selectedCategory === 'All') {
      this.filteredData = [...this.reportData];
    } else {
      this.filteredData = this.reportData.filter(item => item.category === this.selectedCategory);
    }
  }

  exportCSV(): void {
    this.messageService.add({ severity: 'success', summary: 'Export Started', detail: 'Financial report exported as CSV successfully.' });
  }

  exportPDF(): void {
    this.messageService.add({ severity: 'info', summary: 'Export Started', detail: 'Generating PDF report statement...' });
  }

  getStatusSeverity(status: string): TagSeverity {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warn';
      case 'Flagged': return 'danger';
      default: return 'info';
    }
  }
}
