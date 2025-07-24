import { MenuItem } from 'primeng/api';

export const menuPerfilItems = (cerrarSesion: () => void): MenuItem[] => {
  return [
    {
      label: 'usuario',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Mi perfil',
          icon: 'pi pi-user-edit',
        },
        {
          label: 'Update',
          icon: 'pi pi-refresh',
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
        },
        {
          separator: true,
        },
        {
          label: 'Cerrar Sesion',
          icon: 'pi pi-times',
          command: () => cerrarSesion(),
        },
      ],
    },
  ];
};
