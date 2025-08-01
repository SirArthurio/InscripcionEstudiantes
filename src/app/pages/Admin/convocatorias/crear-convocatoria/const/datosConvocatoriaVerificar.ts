import { convocatoria } from '../model/convocatoria.type';

export const datosConvocatoriaVerificacion = (convocatoria: convocatoria) => [
  {
    name: 'Titulo',
    content: convocatoria.title,
  },
  {
    name: 'Codigo',
    content: convocatoria.title,
  },
  {
    name: 'Descripcion',
    content: convocatoria.description,
  },
  {
    name: 'Modalidad',
    content: convocatoria.modality,
  },
  {
    name: 'Cupos Totales',
    content: convocatoria.totalSlots.toString(),
  },
  {
    name: 'Fecha Inicio',
    content: convocatoria.startDate,
  },
  {
    name: 'Fecha Fin',
    content: convocatoria.endDate || '',
  },
];
