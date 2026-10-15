import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule],
  template: `
    <div class="flex flex-column gap-4">
      <div>
        <h1 class="text-3xl font-bold text-900 m-0">Expense Categories</h1>
        <p class="text-600 mt-1 mb-0">Manage and organize corporate expense categories and budgets.</p>
      </div>

      <div class="surface-card p-4 border-round-xl">
        <p-table [value]="categories" styleClass="p-datatable-striped">
          <ng-template pTemplate="header">
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th>Active Budget</th>
              <th class="text-center">Action</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-cat>
            <tr>
              <td class="font-bold text-900">{{ cat.name }}</td>
              <td class="text-600">{{ cat.description }}</td>
              <td class="font-semibold text-primary">{{ cat.budget }}</td>
              <td class="text-center">
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-rounded"></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `
})
export class CategoriesPageComponent {
  categories = [
    { name: 'Rent', description: 'Office and warehouse monthly lease', budget: '$3,500.00' },
    { name: 'Salaries', description: 'Team and developer payroll', budget: '$15,000.00' },
    { name: 'Utilities', description: 'Electricity, water and internet services', budget: '$600.00' },
    { name: 'Transportation', description: 'Travel, fuel and logistics', budget: '$1,000.00' },
    { name: 'Office Supplies', description: 'Stationery, hardware and tools', budget: '$800.00' },
    { name: 'Marketing', description: 'Digital ads and social media campaigns', budget: '$2,000.00' },
    { name: 'Other', description: 'Miscellaneous corporate expenses', budget: '$500.00' }
  ];
}