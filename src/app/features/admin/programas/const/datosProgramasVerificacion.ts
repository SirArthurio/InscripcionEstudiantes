import { programs } from '@core/shared/types/programas.type';

export const datosProgramaVerificacion = (programa: programs) => [
  {
    name: 'Codigo',
    content: programa.code,
  },
  {
    name: 'Nombre',
    content: programa.name,
  },
  {
    name: 'Descripcion',
    content: programa.description,
  },
];
