import { Component, inject } from '@angular/core';
import { DashboardGenericComponent } from './components/dashboard-generic/dashboard.Generic.component';
import { currentStore } from '../../auth/store/current.store';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardGenericComponent],
  template: `
    <div class="grid grid-cols-1 gap-8">
      <app-dashboard-Generic />
    </div>
  `,
})
export class Dashboard {
  currentUserStore = inject(currentStore);
  get getUser() {
    return this.currentUserStore.user();
  }
}
