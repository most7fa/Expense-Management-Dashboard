import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ExpenseService } from '../../../../core/services/expense.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss'
})
export class SettingsPage {
  constructor(private service: ExpenseService, private confirmation: ConfirmationService, private messages: MessageService) {}
  reset(): void {
    this.confirmation.confirm({
      header: 'Reset demo data',
      message: 'This will replace your current expenses with the original sample data. Continue?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Reset data',
      rejectLabel: 'Cancel',
      accept: () => { this.service.resetDemoData(); this.messages.add({ severity: 'success', summary: 'Demo data restored', detail: 'Sample expenses have been restored.' }); }
    });
  }
}
