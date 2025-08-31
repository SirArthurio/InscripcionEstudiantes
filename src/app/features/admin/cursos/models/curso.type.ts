import { baseCode } from '@core/shared/types';
import { competenciaDto } from '../../competencias/model/competenciaDto.type';

export type curso = baseCode & {
  credits: number;
  weeklyHours: number;
  competency: string;
};
