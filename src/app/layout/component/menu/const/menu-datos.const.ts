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
      {
        label: 'Programas',
        icon: 'pi pi-book',
        items: [
          {
            icon: 'pi pi-book',
            label: 'Ver Programas',
            routerLink: ['/admin/programas/ver-programas'],
            roles: ['superadmin', 'profesor'],
          },
        ],
      },
      {
        label: 'Facultades',
        icon: 'pi pi-book',
        items: [
          {
            icon: 'pi pi-book',
            label: 'Ver Facultades',
            routerLink: ['/admin/facultades/ver-facultades'],
            roles: ['superadmin', 'profesor'],
          },
          {
            icon: 'pi pi-book',
            label: 'Crear Facultad',
            routerLink: ['/admin/facultades/crear-facultad'],
            roles: ['superadmin', 'profesor'],
          },
        ],
      },
      {
        label: 'Competencias',
        icon: 'pi pi-book',
        items: [
          {
            icon: 'pi pi-book',
            label: 'Ver competencias',
            routerLink: ['/admin/competencias/ver-competencias'],
            roles: ['superadmin', 'profesor'],
          },
          {
            icon: 'pi pi-book',
            label: 'Crear competencia',
            routerLink: ['/admin/competencias/crear-competencias'],
            roles: ['superadmin', 'profesor'],
          },
        ],
      },
      {
        label: 'Docente',
        icon: 'pi pi-user',
        items: [
          {
            icon: 'pi pi-user',
            label: 'Ver docentes',
            routerLink: ['/admin/professors/ver-professor'],
            roles: ['superadmin', 'profesor'],
          },
          {
            icon: 'pi pi-user',
            label: 'Crear docente',
            routerLink: ['/admin/professors/crear-professor'],
            roles: ['superadmin', 'profesor'],
          },
        ],
      },
      {
        label: 'Horarios',
        icon: 'pi pi-clock',
        items: [
          {
            icon: 'pi pi-clock',
            label: 'Ver horarios',
            routerLink: ['/admin/horarios/ver-horarios'],
            roles: ['superadmin', 'profesor'],
          },
          {
            icon: 'pi pi-clock',
            label: 'Crear horario',
            routerLink: ['/admin/horarios/crear-horarios'],
            roles: ['superadmin', 'profesor'],
          },
        ],
      },
      {
        label: 'Cursos',
        icon: 'pi pi-book',
        items: [
          {
            icon: 'pi pi-book',
            label: 'Ver cursos',
            routerLink: ['/admin/cursos/ver-cursos'],
            roles: ['superadmin', 'profesor'],
          },
          {
            icon: 'pi pi-book',
            label: 'Crear cursos',
            routerLink: ['/admin/cursos/crear-cursos'],
            roles: ['superadmin', 'profesor'],
          },
        ],
      },
      {
        label: 'Grupos',
        icon: 'pi pi-book',
        items: [
          {
            icon: 'pi pi-book',
            label: 'Ver Grupos',
            routerLink: ['/admin/grupos/ver-grupos'],
            roles: ['superadmin', 'profesor'],
          },
          {
            icon: 'pi pi-book',
            label: 'Crear Grupos',
            routerLink: ['/admin/grupos/crear-grupos'],
            roles: ['superadmin', 'profesor'],
          },
        ],
      },
    ],
  },
];
