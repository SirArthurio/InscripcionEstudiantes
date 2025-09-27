import { baseCode } from '@core/shared/types';

export type convocatoria = baseCode & {
  totalSlots: number;
  modality: string;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
};
