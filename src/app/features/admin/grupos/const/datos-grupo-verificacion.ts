import { programs } from '@core/shared/types/programas.type';
import { grupo } from '../model/grupo.type';
import { grupoDto } from '../model/grupoDto.type';

export const datosGrupoVerificacion = (grupo: grupoDto) => [
  {
    name: 'Modalidad',
    content: grupo.modality,
  },
  {
    name: 'Observaciones',
    content: grupo.observations,
  },
];
