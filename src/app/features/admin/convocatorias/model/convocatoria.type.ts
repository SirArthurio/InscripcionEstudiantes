import { baseCode } from '@core/shared/types';

export type convocatoria = baseCode & {
  modality: string;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
};
