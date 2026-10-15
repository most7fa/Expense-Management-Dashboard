import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="flex flex-column gap-4">
      <div class="flex justify-content-between align-items-center">
        <div>
          <h1 class="text-3xl font-bold text-900 m-0">Financial Reports</h1>
          <p class="text-600 mt-1 mb-0">Generate and export detailed financial statements and audit logs.</p>
        </div>
        <button pButton label="Export PDF Report" icon="pi pi-file-pdf" class="p-button-danger"></button>
      </div>

      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="surface-card p-4 border-round-xl">
            <h3 class="text-xl font-bold text-900 mb-3">Monthly Summary Report</h3>
            <p class="text-600 mb-4">Comprehensive breakdown of total cash flows, inflows, and outflows for the current fiscal year.</p>
            <button pButton label="Download Summary" icon="pi pi-download" class="p-button-outlined"></button>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="surface-card p-4 border-round-xl">
            <h3 class="text-xl font-bold text-900 mb-3">Tax & Compliance Report</h3>
            <p class="text-600 mb-4">Itemized expense tracking formatted for tax filing and annual corporate accounting.</p>
            <button pButton label="Download Tax Log" icon="pi pi-download" class="p-button-outlined"></button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReportsPageComponent {}