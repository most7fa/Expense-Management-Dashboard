import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../../../core/constants/expense-data.constant';
import { Expense } from '../../../../core/models/expense.model';

@Component({
  selector: 'app-expense-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    TextareaModule
  ],
  templateUrl: './expense-form-dialog.html',
  styleUrls: ['./expense-form-dialog.scss']
})
export class ExpenseFormDialogComponent implements OnInit {
  expenseForm!: FormGroup;
  categories = EXPENSE_CATEGORIES;
  paymentMethods = PAYMENT_METHODS;
  isEditMode = false;
  expenseToEdit?: Expense;

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.expenseToEdit = this.config.data?.expense;
    this.isEditMode = !!this.expenseToEdit;

    this.initForm();
  }

  private initForm(): void {
    this.expenseForm = this.fb.group({
      description: [this.expenseToEdit?.description || '', [Validators.required, Validators.minLength(3)]],
      amount: [this.expenseToEdit?.amount || null, [Validators.required, Validators.min(0.01)]],
      category: [this.expenseToEdit?.category || null, [Validators.required]],
      paymentMethod: [this.expenseToEdit?.paymentMethod || null, [Validators.required]],
      date: [this.expenseToEdit?.date ? new Date(this.expenseToEdit.date) : new Date(), [Validators.required]],
      notes: [this.expenseToEdit?.notes || '']
    });
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    const formValues = this.expenseForm.value;
    const formattedData = {
      ...formValues,
      date: formValues.date instanceof Date 
        ? formValues.date.toISOString().split('T')[0] 
        : formValues.date
    };

    this.ref.close(formattedData);
  }

  onCancel(): void {
    this.ref.close();
  }
}
