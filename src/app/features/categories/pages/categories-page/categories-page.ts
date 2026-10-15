import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  budget: number;
  spent: number;
  colorClass: string;
}

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TagModule,
    ToastModule,
    ProgressBarModule,
    TooltipModule,
    CurrencyPipe,
    PercentPipe
  ],
  providers: [MessageService],
  templateUrl: './categories-page.html'
})
export class CategoriesPageComponent implements OnInit {
  categories: CategoryItem[] = [
    { id: '1', name: 'Rent', icon: 'pi-building', description: 'Office space & facility leases', budget: 3500, spent: 2500, colorClass: 'bg-blue-500' },
    { id: '2', name: 'Salaries', icon: 'pi-users', description: 'Payroll & contractor payments', budget: 15000, spent: 12400, colorClass: 'bg-emerald-500' },
    { id: '3', name: 'Utilities', icon: 'pi-bolt', description: 'Electricity, internet & water', budget: 1000, spent: 1050, colorClass: 'bg-amber-500' },
    { id: '4', name: 'Transportation', icon: 'pi-car', description: 'Logistics, travel & fleet fuel', budget: 1200, spent: 850, colorClass: 'bg-orange-500' },
    { id: '5', name: 'Office Supplies', icon: 'pi-box', description: 'Hardware, paper & office gear', budget: 800, spent: 680, colorClass: 'bg-purple-500' },
    { id: '6', name: 'Marketing', icon: 'pi-mega-phone', description: 'Ad campaigns & public relations', budget: 3000, spent: 1850, colorClass: 'bg-pink-500' },
    { id: '7', name: 'Software & Cloud', icon: 'pi-cloud', description: 'SaaS subscriptions & servers', budget: 2000, spent: 1920, colorClass: 'bg-indigo-500' }
  ];

  filteredCategories: CategoryItem[] = [];
  searchQuery: string = '';
  isDialogVisible = false;
  isEditMode = false;
  
  currentCategory: CategoryItem = this.getEmptyCategory();

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.filteredCategories = [...this.categories];
  }

  get totalBudget(): number {
    return this.categories.reduce((acc, c) => acc + c.budget, 0);
  }

  get totalSpent(): number {
    return this.categories.reduce((acc, c) => acc + c.spent, 0);
  }

  get overallUtilization(): number {
    return this.totalBudget ? (this.totalSpent / this.totalBudget) * 100 : 0;
  }

  getBudgetPercentage(spent: number, budget: number): number {
    if (!budget) return 0;
    const pct = Math.round((spent / budget) * 100);
    return pct > 100 ? 100 : pct;
  }

  getBudgetSeverity(spent: number, budget: number): string {
    const ratio = spent / budget;
    if (ratio >= 1) return 'bg-rose-500';
    if (ratio >= 0.85) return 'bg-amber-500';
    return 'bg-emerald-500';
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredCategories = this.categories.filter(c => 
      c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }

  openAddDialog(): void {
    this.isEditMode = false;
    this.currentCategory = this.getEmptyCategory();
    this.isDialogVisible = true;
  }

  openEditDialog(cat: CategoryItem): void {
    this.isEditMode = true;
    this.currentCategory = { ...cat };
    this.isDialogVisible = true;
  }

  saveCategory(): void {
    if (!this.currentCategory.name.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category name is required' });
      return;
    }

    if (this.isEditMode) {
      const idx = this.categories.findIndex(c => c.id === this.currentCategory.id);
      if (idx !== -1) {
        this.categories[idx] = { ...this.currentCategory };
      }
      this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Category details updated' });
    } else {
      this.currentCategory.id = Date.now().toString();
      this.categories.push({ ...this.currentCategory });
      this.messageService.add({ severity: 'success', summary: 'Created', detail: 'New category added' });
    }

    this.onSearch();
    this.isDialogVisible = false;
  }

  deleteCategory(id: string): void {
    this.categories = this.categories.filter(c => c.id !== id);
    this.onSearch();
    this.messageService.add({ severity: 'info', summary: 'Deleted', detail: 'Category removed' });
  }

  private getEmptyCategory(): CategoryItem {
    return {
      id: '',
      name: '',
      icon: 'pi-tag',
      description: '',
      budget: 0,
      spent: 0,
      colorClass: 'bg-blue-500'
    };
  }
}