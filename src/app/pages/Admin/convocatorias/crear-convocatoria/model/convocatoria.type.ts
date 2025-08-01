export type convocatoria = {
  id?: string;
  code: string;
  title: string;
  description: string;
  totalSlots: number;
  modality: string;
  startDate: string;
  endDate?: string;
};
