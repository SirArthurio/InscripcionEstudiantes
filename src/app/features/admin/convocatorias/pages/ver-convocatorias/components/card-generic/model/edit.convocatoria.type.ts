import { baseCode } from '@core/shared/types';

export type editTextConvocatoria = Omit<baseCode, 'code'> & {};
export type editFechasConvocatoria = {
  enrollmentStartDate: string;
  enrollmentEndDate: string;
};
