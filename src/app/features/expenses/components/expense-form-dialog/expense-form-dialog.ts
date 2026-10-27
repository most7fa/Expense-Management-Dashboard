import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { finalize } from 'rxjs';
import { Expense, ExpenseInput, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../../../core/models/expense.model';
import { ExpenseService } from '../../../../core/services/expense.service';

@Component({
  selector: 'app-expense-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, InputNumberModule, SelectModule, DatePickerModule, TextareaModule],
  templateUrl: './expense-form-dialog.html',
  styleUrl: './expense-form-dialog.scss'
})
export class ExpenseFormDialog implements OnChanges {
  @Input() visible = false;
  @Input() expense: Expense | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<void>();
  categories = EXPENSE_CATEGORIES.map(value => ({ label: value, value }));
  paymentMethods = PAYMENT_METHODS.map(value => ({ label: value, value }));
  saving = false;
  error = '';
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ExpenseService);

  form = this.fb.group({
    description: ['', [Validators.required, Validators.maxLength(120)]],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    category: [null as string | null, Validators.required],
    date: [new Date() as Date | null, Validators.required],
    paymentMethod: [null as string | null, Validators.required],
    notes: ['', Validators.maxLength(1000)]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] || changes['expense']) {
      this.error = '';
      if (this.visible && this.expense) {
        this.form.reset({
          description: this.expense.description,
          amount: this.expense.amount,
          category: this.expense.category,
          date: new Date(`${this.expense.date}T00:00:00`),
          paymentMethod: this.expense.paymentMethod,
          notes: this.expense.notes ?? ''
        });
      } else if (this.visible) {
        this.form.reset({ description: '', amount: null, category: null, date: new Date(), paymentMethod: null, notes: '' });
      }
    }
  }

  close(): void { this.visible = false; this.visibleChange.emit(false); }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving) return;
    const value = this.form.getRawValue();
    const input: ExpenseInput = {
      description: value.description!.trim(),
      amount: value.amount!,
      category: value.category as ExpenseInput['category'],
      date: value.date!.toISOString().slice(0, 10),
      paymentMethod: value.paymentMethod as ExpenseInput['paymentMethod'],
      notes: (value.notes ?? '').trim()
    };
    this.saving = true;
    const request = this.expense
      ? this.service.updateExpense(this.expense.id, input)
      : this.service.createExpense(input);
    request.pipe(finalize(() => this.saving = false)).subscribe({
      next: () => { this.saved.emit(); this.close(); },
      error: err => this.error = err?.message || 'Unable to save this expense. Please try again.'
    });
  }

  invalid(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
