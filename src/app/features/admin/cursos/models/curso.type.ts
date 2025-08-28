import { baseCode } from '@core/shared/types';

export type curso = baseCode & {
  credits: number;
  weeklyHours: number;
  competency: string;
};
