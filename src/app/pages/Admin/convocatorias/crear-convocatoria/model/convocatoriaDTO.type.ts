import { convocatoria } from './convocatoria.type';

export type convocatoriaDTO = Omit<convocatoria, 'totalSlots'> & {
  status: string;
};
