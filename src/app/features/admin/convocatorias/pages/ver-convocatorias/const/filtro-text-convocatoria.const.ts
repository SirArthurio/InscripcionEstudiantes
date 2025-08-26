import { GrupoFiltros } from '@core/shared/types';

export const filtroTextConvocatoria: GrupoFiltros[] = [
  {
    titulo: 'Estados',
    parametro: 'status',
    botones: [
      {
        key: 'tech',
        label: 'Cancelado',
        value: 'cancelada',
        icon: 'pi pi-desktop',
        color: 'info',
      },
      {
        key: 'design',
        label: 'Cerrado',
        value: 'cerrada',
        icon: 'pi pi-palette',
        color: 'success',
      },
      {
        key: 'business',
        label: 'Borrador',
        value: 'borrador',
        icon: 'pi pi-briefcase',
        color: 'warning',
      },
      {
        key: 'marketing',
        label: 'Publicado',
        value: 'publicada',
        icon: 'pi pi-megaphone',
        color: 'help',
      },
    ],
  },
];
