import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ExpenseService } from '../../../../core/services/expense.service';
import { EXPENSE_CATEGORIES } from '../../../../core/models/expense.model';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss'
})
export class CategoriesPage {
  categories = EXPENSE_CATEGORIES;
  constructor(private service: ExpenseService) {}
}
