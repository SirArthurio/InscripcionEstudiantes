import { statusCursos } from '@core/shared/enums/status-cursos-type.enum';
import { GrupoFiltros } from '@core/shared/types';

export const filtroTextCurso: GrupoFiltros[] = [
  {
    titulo: 'Estados',
    parametro: 'status',
    botones: [
      {
        key: 'tech',
        label: 'Activo',
        value: statusCursos.activo,
        icon: 'pi pi-desktop',
        color: 'info',
      },
      {
        key: 'design',
        label: 'Archivado',
        value: statusCursos.archivado,
        icon: 'pi pi-palette',
        color: 'success',
      },
    ],
  },
];
