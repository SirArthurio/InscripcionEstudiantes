import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../app.configurator';
import { LayoutService } from '../../service/layout.service';
import { MenuModule } from 'primeng/menu';
import { menuPerfilItems } from './consts/menuPerfilItems.const';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    AppConfigurator,
    MenuModule,
    MenubarModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './topbar.component.html',
})
export class AppTopbar {
  items!: MenuItem[];
  router = inject(Router);
  mostrarCalendario = false;

  constructor(public layoutService: LayoutService) {}

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
  }

  cerrarSesion() {
    this.router.navigate(['/auth/login']);
  }
  menuPerfilItems = menuPerfilItems(() => this.cerrarSesion());
}
