import { baseCode } from '@core/shared/types';
import { curso } from './curso.type';
import { statusCursos } from '@core/shared/enums/status-cursos-type.enum';

export type cursoDto = curso & {
  status: statusCursos;
};
