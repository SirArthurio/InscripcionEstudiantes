import { facultie } from '../model/facultie.type';

export const datosFacultadVerificacion = (facultad: facultie) => [
  {
    name: 'Codigo',
    content: facultad.code,
  },
  {
    name: 'Nombre',
    content: facultad.name,
  },
  {
    name: 'Descripcion',
    content: facultad.description,
  },
];
