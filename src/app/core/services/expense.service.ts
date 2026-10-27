import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of, throwError } from 'rxjs';
import { DashboardStats, Expense, ExpenseInput, EXPENSE_CATEGORIES } from '../models/expense.model';

const STORAGE_KEY = 'expense-management-dashboard.expenses';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly expensesSubject = new BehaviorSubject<Expense[]>(this.loadInitialData());
  readonly expenses$ = this.expensesSubject.asObservable();

  getExpenses(): Observable<Expense[]> {
    return this.expenses$.pipe(delay(180), map(items => [...items].sort((a, b) => b.date.localeCompare(a.date))));
  }

  getExpenseById(id: string): Observable<Expense | undefined> {
    return this.expenses$.pipe(map(items => items.find(item => item.id === id)), delay(120));
  }

  createExpense(input: ExpenseInput): Observable<Expense> {
    const now = new Date().toISOString();
    const expense: Expense = { ...input, id: this.createId(), createdAt: now, updatedAt: now };
    const next = [expense, ...this.expensesSubject.value];
    this.save(next);
    return of(expense).pipe(delay(250));
  }

  updateExpense(id: string, input: ExpenseInput): Observable<Expense> {
    const existing = this.expensesSubject.value.find(item => item.id === id);
    if (!existing) return throwError(() => new Error('Expense not found.'));
    const updated: Expense = { ...existing, ...input, updatedAt: new Date().toISOString() };
    this.save(this.expensesSubject.value.map(item => item.id === id ? updated : item));
    return of(updated).pipe(delay(250));
  }

  deleteExpense(id: string): Observable<boolean> {
    const exists = this.expensesSubject.value.some(item => item.id === id);
    if (!exists) return throwError(() => new Error('Expense not found.'));
    this.save(this.expensesSubject.value.filter(item => item.id !== id));
    return of(true).pipe(delay(200));
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.expenses$.pipe(map(items => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const previousDate = new Date(currentYear, currentMonth - 1, 1);
      const current = items.filter(x => {
        const d = new Date(`${x.date}T00:00:00`);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).reduce((sum, x) => sum + x.amount, 0);
      const previous = items.filter(x => {
        const d = new Date(`${x.date}T00:00:00`);
        return d.getMonth() === previousDate.getMonth() && d.getFullYear() === previousDate.getFullYear();
      }).reduce((sum, x) => sum + x.amount, 0);
      const byCategory = new Map<string, number>();
      items.forEach(x => byCategory.set(x.category, (byCategory.get(x.category) ?? 0) + x.amount));
      const highest = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0];
      return {
        totalExpenses: items.reduce((sum, x) => sum + x.amount, 0),
        currentMonthExpenses: current,
        previousMonthExpenses: previous,
        transactionCount: items.length,
        highestCategory: highest?.[0] ?? '—',
        highestCategoryAmount: highest?.[1] ?? 0
      };
    }), delay(180));
  }

  getMonthlyChartData(): Observable<{ labels: string[]; values: number[] }> {
    return this.expenses$.pipe(map(items => {
      const labels: string[] = [];
      const values: number[] = [];
      const now = new Date();
      for (let offset = 5; offset >= 0; offset--) {
        const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
        values.push(items.filter(x => {
          const d = new Date(`${x.date}T00:00:00`);
          return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
        }).reduce((sum, x) => sum + x.amount, 0));
      }
      return { labels, values };
    }), delay(180));
  }

  getCategoryChartData(): Observable<{ labels: string[]; values: number[] }> {
    return this.expenses$.pipe(map(items => {
      const values = EXPENSE_CATEGORIES.map(category =>
        items.filter(x => x.category === category).reduce((sum, x) => sum + x.amount, 0));
      return { labels: [...EXPENSE_CATEGORIES], values };
    }), delay(180));
  }

  resetDemoData(): void {
    const data = this.makeDemoData();
    this.save(data);
  }

  private save(items: Expense[]): void {
    this.expensesSubject.next(items);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* storage may be unavailable */ }
  }

  private loadInitialData(): Expense[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Expense[];
    } catch { /* use demo data */ }
    const data = this.makeDemoData();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* storage may be unavailable */ }
    return data;
  }

  private createId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `exp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private makeDemoData(): Expense[] {
    const today = new Date();
    const dateAt = (monthOffset: number, day: number) =>
      new Date(today.getFullYear(), today.getMonth() + monthOffset, day).toISOString().slice(0, 10);
    const now = new Date().toISOString();
    const rows: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>[] = [
      { description: 'Office rent', amount: 18000, category: 'Rent', date: dateAt(0, 2), paymentMethod: 'Bank Transfer', notes: 'Monthly office lease' },
      { description: 'Team salaries', amount: 62000, category: 'Salaries', date: dateAt(0, 4), paymentMethod: 'Bank Transfer', notes: 'Monthly payroll' },
      { description: 'Internet and electricity', amount: 4200, category: 'Utilities', date: dateAt(0, 8), paymentMethod: 'Debit Card', notes: '' },
      { description: 'Client meeting transport', amount: 850, category: 'Transportation', date: dateAt(0, 11), paymentMethod: 'Cash', notes: 'Taxi and parking' },
      { description: 'Printer paper and toner', amount: 2100, category: 'Office Supplies', date: dateAt(-1, 6), paymentMethod: 'Credit Card', notes: '' },
      { description: 'Social media campaign', amount: 7500, category: 'Marketing', date: dateAt(-1, 13), paymentMethod: 'Credit Card', notes: 'Campaign expenses' },
      { description: 'Water bill', amount: 650, category: 'Utilities', date: dateAt(-1, 18), paymentMethod: 'Cash', notes: '' },
      { description: 'Equipment repair', amount: 1600, category: 'Other', date: dateAt(-2, 9), paymentMethod: 'Debit Card', notes: '' },
      { description: 'Office rent', amount: 18000, category: 'Rent', date: dateAt(-2, 2), paymentMethod: 'Bank Transfer', notes: 'Monthly office lease' },
      { description: 'Staff transportation', amount: 2400, category: 'Transportation', date: dateAt(-3, 17), paymentMethod: 'Cash', notes: '' },
      { description: 'Cloud software subscription', amount: 3200, category: 'Other', date: dateAt(-4, 21), paymentMethod: 'Credit Card', notes: 'Annual tools prorated' },
      { description: 'Office rent', amount: 18000, category: 'Rent', date: dateAt(-5, 2), paymentMethod: 'Bank Transfer', notes: 'Monthly office lease' }
    ];
    return rows.map((row, index) => ({ ...row, id: `demo-${index + 1}`, createdAt: now, updatedAt: now }));
  }
}
