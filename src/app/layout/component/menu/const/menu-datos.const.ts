import { itemsMenu } from '../model/type/menuItems.type';

export const menu: itemsMenu[] = [
  {
    label: 'Home',
    roles: ['profesor', 'estudiante'],
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/'],
        roles: ['profesor', 'estudiante'],
      },
      {
        label: 'Mis cursos',
        icon: 'pi pi-book',
        routerLink: ['/pages/mis-cursos'],
        roles: ['profesor', 'estudiante'],
      },
      {
        label: 'Solo Estudiantes',
        icon: 'pi pi-user',
        routerLink: ['/pages/solo-estudiantes'],
        roles: ['estudiante'],
      },
    ],
  },
  {
    label: 'Gestion',
    roles: ['admin'],
    items: [
      {
        label: 'Convocatorias',
        icon: 'pi pi-cog',
        routerLink: ['/admin/crear-convocatorias'],
        roles: ['admin'],
      },
    ],
  },
];
