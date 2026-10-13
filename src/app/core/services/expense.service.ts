import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { DashboardSummary, Expense, ExpenseCategory, ExpenseFilter, PaymentMethod } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private expenses: Expense[] = [
    { id: '1', description: 'Office rent', amount: 4200, category: ExpenseCategory.RENT, date: '2026-10-01', paymentMethod: PaymentMethod.BANK_TRANSFER },
    { id: '2', description: 'Team payroll', amount: 12800, category: ExpenseCategory.SALARIES, date: '2026-10-03', paymentMethod: PaymentMethod.BANK_TRANSFER },
    { id: '3', description: 'Social media campaign', amount: 1800, category: ExpenseCategory.MARKETING, date: '2026-09-18', paymentMethod: PaymentMethod.CREDIT_CARD },
    { id: '4', description: 'Electricity bill', amount: 650, category: ExpenseCategory.UTILITIES, date: '2026-09-12', paymentMethod: PaymentMethod.DEBIT_CARD },
    { id: '5', description: 'Office stationery', amount: 430, category: ExpenseCategory.OFFICE_SUPPLIES, date: '2026-08-22', paymentMethod: PaymentMethod.CASH },
    { id: '6', description: 'Client travel', amount: 920, category: ExpenseCategory.TRANSPORTATION, date: '2026-08-14', paymentMethod: PaymentMethod.CREDIT_CARD }
  ];

  getExpenses(filter: ExpenseFilter = {}): Observable<Expense[]> {
    const search = filter.searchQuery?.trim().toLowerCase();
    const start = filter.startDate ? this.toDateKey(filter.startDate) : undefined;
    const end = filter.endDate ? this.toDateKey(filter.endDate) : undefined;
    const results = this.expenses.filter((expense) =>
      (!search || expense.description.toLowerCase().includes(search)) &&
      (!filter.category || expense.category === filter.category) &&
      (!filter.paymentMethod || expense.paymentMethod === filter.paymentMethod) &&
      (!start || expense.date >= start) && (!end || expense.date <= end)
    );
    return of([...results]).pipe(delay(150));
  }

  addExpense(input: Omit<Expense, 'id'>): Observable<Expense> {
    const expense = { ...input, id: crypto.randomUUID() };
    this.expenses = [expense, ...this.expenses];
    return of(expense).pipe(delay(150));
  }

  updateExpense(id: string, input: Omit<Expense, 'id'>): Observable<Expense> {
    const updated = { ...input, id };
    this.expenses = this.expenses.map((expense) => expense.id === id ? updated : expense);
    return of(updated).pipe(delay(150));
  }

  deleteExpense(id: string): Observable<void> {
    this.expenses = this.expenses.filter((expense) => expense.id !== id);
    return of(void 0).pipe(delay(150));
  }

  getDashboardSummary(): Observable<DashboardSummary> {
    const totalExpenses = this.expenses.reduce((total, expense) => total + expense.amount, 0);
    const totalsByCategory = new Map<ExpenseCategory, number>();
    const totalsByMonth = new Map<string, number>();

    for (const expense of this.expenses) {
      totalsByCategory.set(expense.category, (totalsByCategory.get(expense.category) ?? 0) + expense.amount);
      const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(`${expense.date}T00:00:00`));
      totalsByMonth.set(month, (totalsByMonth.get(month) ?? 0) + expense.amount);
    }

    const categories = [...totalsByCategory.entries()].map(([category, amount]) => ({ category, amount }));
    const topCategory = categories.reduce<{ category: ExpenseCategory; amount: number } | null>(
      (top, category) => (!top || category.amount > top.amount ? category : top),
      null
    );

    const currentMonthExpenses = this.expenses
      .filter((expense) => expense.date.startsWith('2026-10'))
      .reduce((total, expense) => total + expense.amount, 0);
    const previousMonthExpenses = this.expenses
      .filter((expense) => expense.date.startsWith('2026-09'))
      .reduce((total, expense) => total + expense.amount, 0);

    return of({
      totalExpenses,
      currentMonthExpenses,
      previousMonthExpenses,
      totalTransactions: this.expenses.length,
      topCategory,
      expensesByMonth: [...totalsByMonth.entries()].map(([month, amount]) => ({ month, amount })),
      expensesByCategory: categories
    }).pipe(delay(250));
  }

  private toDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
