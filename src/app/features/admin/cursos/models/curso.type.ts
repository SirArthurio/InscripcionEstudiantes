import { baseCode } from '@core/shared/types';
import { competencias } from '../../competencias/model/competencias.type';

export type curso = baseCode & {
  credits: number;
  weeklyHours: number;
  competency: string;
};
