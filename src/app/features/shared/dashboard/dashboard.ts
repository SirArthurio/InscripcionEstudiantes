import { Component, inject } from '@angular/core';
import { DashboardGenericComponent } from './components/dashboard-generic/dashboard.Generic.component';
import { CurrentStore } from '../../auth/store/current.store';
import { UserTypes } from '@core/shared/enums/user-types.enum';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardGenericComponent],
  template: `
    <div class="grid grid-cols-1 gap-8">
      <app-dashboard-Generic [urlConvocatoria]="url" />
    </div>
  `,
})
export class Dashboard {
  currentUserStore = inject(CurrentStore);
  get getUser() {
    return this.currentUserStore.user();
  }

  get url() {
    switch (this.currentUserStore.role()) {
      case UserTypes.STUDENT:
        return '/students/convocatoria/ver-convocatoria';
      case UserTypes.TEACHER:
        return '/teacher/convocatoria/ver-convocatoria';
      default:
        return '/';
    }
  }
}
