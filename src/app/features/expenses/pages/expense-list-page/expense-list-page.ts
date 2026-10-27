import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Expense, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../../../core/models/expense.model';
import { ExpenseService } from '../../../../core/services/expense.service';
import { ExpenseFormDialog } from '../../components/expense-form-dialog/expense-form-dialog';

@Component({
  selector: 'app-expense-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, ButtonModule, InputTextModule, TableModule, SelectModule, DatePickerModule, DialogModule, ConfirmDialogModule, ToastModule, ExpenseFormDialog],
  providers: [ConfirmationService, MessageService],
  templateUrl: './expense-list-page.html',
  styleUrl: './expense-list-page.scss'
})
export class ExpenseListPage implements OnInit, OnDestroy {
  expenses: Expense[] = [];
  loading = true;
  search = '';
  selectedCategory: string | null = null;
  selectedPayment: string | null = null;
  dateRange: Date[] | null = null;
  formVisible = false;
  selectedExpense: Expense | null = null;
  detailsVisible = false;
  private subscription?: Subscription;
  categories = [{ label: 'All categories', value: null }, ...EXPENSE_CATEGORIES.map(value => ({ label: value, value }))];
  payments = [{ label: 'All payment methods', value: null }, ...PAYMENT_METHODS.map(value => ({ label: value, value }))];

  constructor(private service: ExpenseService, private confirmation: ConfirmationService, private messages: MessageService) {}

  ngOnInit(): void {
    this.subscription = this.service.expenses$.subscribe(items => { this.expenses = [...items].sort((a,b) => b.date.localeCompare(a.date)); this.loading = false; });
  }
  ngOnDestroy(): void { this.subscription?.unsubscribe(); }
  get filtered(): Expense[] {
    const term = this.search.trim().toLowerCase();
    return this.expenses.filter(x =>
      (!term || x.description.toLowerCase().includes(term) || x.notes.toLowerCase().includes(term)) &&
      (!this.selectedCategory || x.category === this.selectedCategory) &&
      (!this.selectedPayment || x.paymentMethod === this.selectedPayment) &&
      (!this.dateRange?.[0] || new Date(`${x.date}T00:00:00`) >= this.startOfDay(this.dateRange[0])) &&
      (!this.dateRange?.[1] || new Date(`${x.date}T00:00:00`) <= this.endOfDay(this.dateRange[1]))
    );
  }
  private startOfDay(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  private endOfDay(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999); }
  openAdd(): void { this.selectedExpense = null; this.formVisible = true; }
  openEdit(expense: Expense): void { this.selectedExpense = expense; this.formVisible = true; }
  openDetails(expense: Expense): void { this.selectedExpense = expense; this.detailsVisible = true; }
  onSaved(): void { this.messages.add({ severity: 'success', summary: 'Saved', detail: 'Expense saved successfully.' }); }
  clearFilters(): void { this.search = ''; this.selectedCategory = null; this.selectedPayment = null; this.dateRange = null; }
  deleteExpense(expense: Expense): void {
    this.confirmation.confirm({
      header: 'Delete expense',
      message: `Delete "${expense.description}"? This action cannot be undone.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.service.deleteExpense(expense.id).subscribe({
        next: () => this.messages.add({ severity: 'success', summary: 'Deleted', detail: 'Expense deleted successfully.' }),
        error: () => this.messages.add({ severity: 'error', summary: 'Error', detail: 'Could not delete the expense.' })
      })
    });
  }
}
