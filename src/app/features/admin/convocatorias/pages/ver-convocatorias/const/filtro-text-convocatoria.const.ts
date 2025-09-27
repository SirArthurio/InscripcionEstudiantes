import { statusConvocatorias } from '@core/shared/enums/status-convocatorias-type.enum';
import { GrupoFiltros } from '@core/shared/types';

export const filtroTextConvocatoria: GrupoFiltros[] = [
  {
    titulo: 'Estados',
    parametro: 'status',
    botones: [
      {
        key: 'tech',
        label: 'Cancelado',
        value: statusConvocatorias.cancelada,
        icon: 'pi pi-desktop',
        color: 'info',
      },
      {
        key: 'design',
        label: 'Cerrado',
        value: statusConvocatorias.cerrada,
        icon: 'pi pi-palette',
        color: 'success',
      },
      {
        key: 'business',
        label: 'Borrador',
        value: statusConvocatorias.borrador,
        icon: 'pi pi-briefcase',
        color: 'warning',
      },
      {
        key: 'marketing',
        label: 'Publicado',
        value: statusConvocatorias.publicada,
        icon: 'pi pi-megaphone',
        color: 'help',
      },
    ],
  },
];
