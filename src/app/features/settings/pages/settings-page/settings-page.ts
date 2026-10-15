import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule],
  template: `
    <div class="flex flex-column gap-4" style="max-width: 700px;">
      <div>
        <h1 class="text-3xl font-bold text-900 m-0">Settings</h1>
        <p class="text-600 mt-1 mb-0">Manage workspace preferences, currency, and company profile details.</p>
      </div>

      <div class="surface-card p-5 border-round-xl flex flex-column gap-4">
        <h3 class="text-xl font-bold text-900 m-0 border-bottom-1 border-200 pb-3">Company Profile</h3>
        
        <div class="flex flex-column gap-2">
          <label class="font-medium text-900 text-sm">Company Name</label>
          <input type="text" pInputText value="My Company Ltd." class="w-full" />
        </div>

        <div class="flex flex-column gap-2">
          <label class="font-medium text-900 text-sm">Base Currency</label>
          <input type="text" pInputText value="USD ($)" class="w-full" disabled />
        </div>

        <div class="flex flex-column gap-2">
          <label class="font-medium text-900 text-sm">Administrative Email</label>
          <input type="text" pInputText value="admin@expensepro.com" class="w-full" />
        </div>

        <div class="flex justify-content-end pt-3 border-top-1 border-200">
          <button pButton label="Save Changes" icon="pi pi-check"></button>
        </div>
      </div>
    </div>
  `
})
export class SettingsPageComponent {}
