import { programs } from '@core/shared/types/programas.type';
import { grupo } from '../model/grupo.type';

export const datosGrupoVerificacion = (programa: grupo) => [
  {
    name: 'Codigo',
    content: programa.code,
  },
  {
    name: 'Id Convocatoria',
    content: programa.callId,
  },
  {
    name: 'Id Curso',
    content: programa.courseId,
  },
  {
    name: 'Modalidad',
    content: programa.modality,
  },
  {
    name: 'Observaciones',
    content: programa.observations,
  },
  {
    name: 'Id Profesor',
    content: programa.professorId,
  },
];
