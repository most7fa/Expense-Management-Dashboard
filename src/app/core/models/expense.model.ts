export const EXPENSE_CATEGORIES = [
  'Rent', 'Salaries', 'Utilities', 'Transportation',
  'Office Supplies', 'Marketing', 'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export const PAYMENT_METHODS = [
  'Cash', 'Bank Transfer', 'Credit Card', 'Debit Card'
] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number];

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseInput = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;

export interface DashboardStats {
  totalExpenses: number;
  currentMonthExpenses: number;
  previousMonthExpenses: number;
  transactionCount: number;
  highestCategory: string;
  highestCategoryAmount: number;
}
