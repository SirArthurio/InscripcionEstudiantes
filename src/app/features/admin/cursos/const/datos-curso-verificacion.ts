import { curso } from '../models/curso.type';

export const datosCursoVerificacion = (curso: curso) => [
  {
    name: 'Codigo',
    content: curso.code,
  },
  {
    name: 'Nombre',
    content: curso.name,
  },
  {
    name: 'Descripcion',
    content: curso.description,
  },
];
