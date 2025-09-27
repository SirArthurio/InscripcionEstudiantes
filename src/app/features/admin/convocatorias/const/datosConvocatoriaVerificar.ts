import { convocatoriaDTO } from '../model/convocatoriaDTO.type';

export const datosConvocatoriaVerificacion = (
  convocatoria: convocatoriaDTO
) => [
  {
    name: 'Nombre',
    content: convocatoria.name,
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
];
