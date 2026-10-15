import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ToggleSwitchModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './settings-page.html'
})
export class SettingsPageComponent implements OnInit {
  companyName = 'My Company LLC';
  companyEmail = 'finance@mycompany.com';
  taxId = 'TAX-9988231-001';
  address = '14 Financial District, Suite 400, NY';

  selectedCurrency = 'USD';
  currencies = [
    { label: 'USD ($)', value: 'USD' },
    { label: 'EUR (€)', value: 'EUR' },
    { label: 'GBP (£)', value: 'GBP' },
    { label: 'EGP (EGP)', value: 'EGP' }
  ];

  emailNotifications = true;
  budgetAlerts = true;
  autoApprove = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}

  saveSettings(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Settings Saved',
      detail: 'Corporate preferences and profile updated successfully.'
    });
  }
}
