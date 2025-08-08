import { itemsMenu } from '../model/type/menuItems.type';

export const menu: itemsMenu[] = [
  {
    label: 'Menu Principal',
    roles: ['profesor', 'student', 'superadmin'],
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/'],
        roles: ['profesor', 'student', 'superadmin'],
      },

      {
        label: 'Mis cursos',
        icon: 'pi pi-book',
        routerLink: ['/pages/mis-cursos'],
        roles: ['profesor', 'student'],
      },
      {
        label: 'Solo Estudiantes',
        icon: 'pi pi-user',
        routerLink: ['/pages/solo-estudiantes'],
        roles: ['student'],
      },
    ],
  },
  {
    label: 'Gestion',
    roles: ['superadmin', 'profesor'],
    items: [
      {
        label: 'Convocatorias',
        icon: 'pi pi-cog',
        items: [
          {
            icon: 'pi pi-cog',
            label: 'Crear Nueva Convocatoria',
            routerLink: ['/admin/convocatorias/crear-convocatorias'],
            roles: ['superadmin', 'profesor'],
          },
          {
            icon: 'pi pi-cog',
            label: 'Ver Convocatorias',
            routerLink: ['/admin/convocatorias/ver-convocatorias'],
            roles: ['superadmin', 'profesor'],
          },
        ],
      },
      {
        label: 'Estudiantes',
        icon: 'pi pi-users',
        items: [
          {
            icon: 'pi pi-users',
            label: 'Ver Estudiantes',
            routerLink: ['/pages/estudiantes/lista-estudiantes'],
            roles: ['superadmin', 'profesor'],
          },
        ],
      },
    ],
  },
];
