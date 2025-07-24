import { Component } from '@angular/core';
import { DashboardGenericComponent } from '../../components/dashboard/dashboard-generic/dashboard.Generic.component';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardGenericComponent],
  template: `
    <div class="grid grid-cols-1 gap-8">
      <app-dashboard-Generic />
    </div>
  `,
})
export class Dashboard {}
