import { Component, effect, inject, input, signal } from '@angular/core';
import { UserTypes } from '@core/shared/enums/user-types.enum';
import { UserRole } from '@core/shared/types/currentUser.type';
import { AvatarModule } from 'primeng/avatar';
import { currentStore } from 'src/app/features/auth/store/current.store';

interface header {
  title: string;
  subtitle: string;
  periodo: string;
}
interface content {
  firstName: string;
  lastName: string;
  role?: string;
  carrer?: string;
}
@Component({
  selector: 'app-header-dashboard',
  imports: [AvatarModule],
  templateUrl: './header-dashboard.component.html',
  styleUrl: './header-dashboard.component.scss',
})
export class HeaderDashboardComponent {
  header = input<header | null>(null);
  currentUserStore = inject(currentStore);

  user = signal<content>({
    firstName: '',
    role: '',
    carrer: '',
    lastName: '',
  });

  getUser = effect(() => {
    const user =
      this.currentUserStore[this.currentUserStore.role() as keyof UserRole]();
    if (user) {
      this.user.set(user);
    }
  });
  get itsLogin() {
    return this.currentUserStore.isLogin();
  }
  //prueba
}
