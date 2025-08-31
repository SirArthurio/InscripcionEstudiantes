import { baseCode } from '@core/shared/types';
import { statusCursos } from '@core/shared/enums/status-cursos-type.enum';
import { competenciaDto } from '../../competencias/model/competenciaDto.type';

export type cursoDto = baseCode & {
  status: statusCursos;
  credits: number;
  weeklyHours: number;
  competency: competenciaDto;
};
