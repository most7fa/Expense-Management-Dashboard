export enum ExpenseCategory {
  RENT = 'Rent',
  SALARIES = 'Salaries',
  UTILITIES = 'Utilities',
  TRANSPORTATION = 'Transportation',
  OFFICE_SUPPLIES = 'Office Supplies',
  MARKETING = 'Marketing',
  OTHER = 'Other'
}

export enum PaymentMethod {
  CASH = 'Cash',
  BANK_TRANSFER = 'Bank Transfer',
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card'
}

export const EXPENSE_CATEGORIES = Object.values(ExpenseCategory);
export const PAYMENT_METHODS = Object.values(PaymentMethod);