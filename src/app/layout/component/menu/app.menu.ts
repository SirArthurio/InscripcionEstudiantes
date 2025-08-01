import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../app.menuitem';
import { itemsMenu } from './model/type/menuItems.type';
import { menu } from './const/menu-datos.const';
import { currentStore } from 'src/app/pages/auth/store/current.store';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    <ng-container *ngFor="let item of model(); let i = index">
      <li
        app-menuitem
        *ngIf="!item.separator"
        [item]="item"
        [index]="i"
        [root]="true"
      ></li>
      <li *ngIf="item.separator" class="menu-separator"></li>
    </ng-container>
  </ul> `,
})
export class AppMenu {
  model = signal<MenuItem[]>([]);
  currentUserStore = inject(currentStore);
  rol = signal<string>('');

  role = effect(() => {
    this.rol.set(this.currentUserStore.role());
    const menuItems = menu;
    this.model.set(this.filterMenuByRole(menuItems, this.rol()) as MenuItem[]);
    console.log('rol:', this.rol());
  });

  filterMenuByRole(items: itemsMenu[], role: string): MenuItem[] {
    return items
      .filter((item) => !item.roles || item.roles.includes(role))
      .map((item) => ({
        ...item,
        items: item.items
          ? item.items.filter(
              (item) => !item.roles || item.roles.includes(role)
            )
          : undefined,
      }))
      .filter((item) => item.items === undefined || item.items.length > 0);
  }

  ngOnInit() {}
}
