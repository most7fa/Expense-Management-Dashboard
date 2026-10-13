import { ExpenseCategory, PaymentMethod } from '../constants/expense-data.constant';

export { ExpenseCategory, PaymentMethod } from '../constants/expense-data.constant';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: string;
  notes?: string;
  createdAt?: string;
}

export interface ExpenseFilter {
  searchQuery?: string;
  category?: ExpenseCategory | null;
  paymentMethod?: PaymentMethod | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface DashboardSummary {
  totalExpenses: number;
  currentMonthExpenses: number;
  previousMonthExpenses: number;
  totalTransactions: number;
  topCategory: { category: string; amount: number } | null;
  expensesByCategory: { category: string; amount: number }[];
  expensesByMonth: { month: string; amount: number }[];
}
