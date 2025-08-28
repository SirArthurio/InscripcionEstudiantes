import { convocatoriaDTO } from '../model/convocatoriaDTO.type';

export const datosConvocatoriaVerificacion = (
  convocatoria: convocatoriaDTO
) => [
  {
    name: 'Nombre',
    content: convocatoria.name,
  },
  {
    name: 'Codigo',
    content: convocatoria.code,
  },
  {
    name: 'Descripcion',
    content: convocatoria.description,
  },
  {
    name: 'Fecha Inicio Convocatoria',
    content: convocatoria.enrollmentStartDate,
  },
  {
    name: 'Fecha Fin Convocatoria',
    content: convocatoria.enrollmentEndDate,
  },
  {
    name: 'Fecha Inicio',
    content: convocatoria.classStartDate,
  },
  {
    name: 'Fecha Fin',
    content: convocatoria.classEndDate || '',
  },
];
