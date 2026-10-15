import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../../../core/services/expense.service';
import { Expense, ExpenseCategory, ExpenseFilter } from '../../../../core/models/expense.model';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, PaymentMethod } from '../../../../core/constants/expense-data.constant';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { TagSeverity } from 'primeng/types/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

import { ExpenseFormDialogComponent } from '../../components/expense-form-dialog/expense-form-dialog';

@Component({
  selector: 'app-expense-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    TagModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    CurrencyPipe,
    DatePipe
  ],
  providers: [DialogService, MessageService, ConfirmationService],
  templateUrl: './expense-list-page.html',
  styleUrls: ['./expense-list-page.scss']
})
export class ExpenseListPageComponent implements OnInit {
  expenses: Expense[] = [];
  isLoading = true;

  searchQuery = '';
  selectedCategory: ExpenseCategory | null = null;
  selectedPaymentMethod: PaymentMethod | null = null;
  dateRange: Date[] | null = null;

  categories = EXPENSE_CATEGORIES;
  paymentMethods = PAYMENT_METHODS;
  
  selectedExpenseForView: Expense | null = null;
  isDetailsDialogVisible = false;
  dialogRef: DynamicDialogRef | null = null;

  constructor(
    private expenseService: ExpenseService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.isLoading = true;
    const filter: ExpenseFilter = {
      searchQuery: this.searchQuery,
      category: this.selectedCategory,
      paymentMethod: this.selectedPaymentMethod,
      startDate: this.dateRange && this.dateRange[0] ? this.dateRange[0] : null,
      endDate: this.dateRange && this.dateRange[1] ? this.dateRange[1] : null
    };

    this.expenseService.getExpenses(filter).subscribe({
      next: (data) => {
        this.expenses = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load expenses' });
      }
    });
  }

  onFilterChange(): void {
    this.loadExpenses();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.selectedPaymentMethod = null;
    this.dateRange = null;
    this.loadExpenses();
  }

  openAddDialog(): void {
    const dialogRef = this.dialogService.open(ExpenseFormDialogComponent, {
      header: 'Add New Expense',
      width: '600px',
      breakpoints: { '640px': '90vw' },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

    if (!dialogRef) return;
    this.dialogRef = dialogRef;
    dialogRef.onClose.subscribe((newData) => {
      if (newData) {
        this.expenseService.addExpense(newData).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense added successfully' });
          this.loadExpenses();
        });
      }
    });
  }

  openEditDialog(expense: Expense): void {
    const dialogRef = this.dialogService.open(ExpenseFormDialogComponent, {
      header: 'Edit Expense',
      width: '600px',
      breakpoints: { '640px': '90vw' },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { expense }
    });

    if (!dialogRef) return;
    this.dialogRef = dialogRef;
    dialogRef.onClose.subscribe((updatedData) => {
      if (updatedData) {
        this.expenseService.updateExpense(expense.id, updatedData).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense updated successfully' });
          this.loadExpenses();
        });
      }
    });
  }

  confirmDelete(expense: Expense): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${expense.description}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.expenseService.deleteExpense(expense.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense deleted successfully' });
          this.loadExpenses();
        });
      }
    });
  }

  viewDetails(expense: Expense): void {
    this.selectedExpenseForView = expense;
    this.isDetailsDialogVisible = true;
  }

  getCategorySeverity(category: ExpenseCategory): TagSeverity {
    switch (category) {
      case ExpenseCategory.SALARIES: return 'success';
      case ExpenseCategory.RENT: return 'warn';
      case ExpenseCategory.MARKETING: return 'info';
      case ExpenseCategory.UTILITIES: return 'danger';
      default: return 'secondary';
    }
  }

  getCategoryBadgeClass(category: string): string {
  switch (category) {
    case 'Rent': return 'badge-rent';
    case 'Salaries': return 'badge-salaries';
    case 'Utilities': return 'badge-utilities';
    case 'Transportation': return 'badge-transportation';
    case 'Office Supplies': return 'badge-office';
    case 'Marketing': return 'badge-marketing';
    default: return 'badge-other';
  }
}
}
