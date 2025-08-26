import { baseCode } from '@core/shared/types';

export type convocatoria = baseCode & {
  totalSlots: number;
  modality: string;
  classStartDate: string;
  classEndDate?: string;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
};
