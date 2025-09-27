import { statusCompetencia } from '@core/shared/enums/status-competencia-type.enum';
import { GrupoFiltros } from '@core/shared/types';

export const filtroTextCompetencias: GrupoFiltros[] = [
  {
    titulo: 'Estados',
    parametro: 'status',
    botones: [
      {
        key: 'tech',
        label: 'Activo',
        value: statusCompetencia.activo,
        icon: 'pi pi-desktop',
        color: 'info',
      },
      {
        key: 'design',
        label: 'Archivado',
        value: statusCompetencia.archivado,
        icon: 'pi pi-palette',
        color: 'success',
      },
    ],
  },
];
