import { statusEstudiantes } from '@core/shared/enums/status-estudiantes-type.enum';
import { GrupoFiltros } from '@core/shared/types';

export const filtrosEstudiantes: GrupoFiltros[] = [
  {
    titulo: 'Estados',
    parametro: 'status',
    botones: [
      {
        key: 'tech',
        label: 'Activo',
        value: statusEstudiantes.activos,
        icon: 'pi pi-check',
        color: 'info',
      },
      {
        key: 'design',
        label: 'Eliminados',
        value: statusEstudiantes.eliminados,
        icon: 'pi pi-eraser',
        color: 'success',
      },
      {
        key: 'business',
        label: 'Graduados',
        value: statusEstudiantes.graduados,
        icon: 'pi pi-graduation-cap',
        color: 'warning',
      },
      {
        key: 'marketing',
        label: 'Pendientes',
        value: statusEstudiantes.pendiente,
        icon: 'pi pi-megaphone',
        color: 'help',
      },
    ],
  },
];
