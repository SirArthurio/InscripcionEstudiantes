import { facultie } from '../model/facultie.type';

export const datosFacultadVerificacion = (facultad: facultie) => [
  {
    name: 'Nombre',
    content: facultad.name,
  },
  {
    name: 'Descripcion',
    content: facultad.description,
  },
];
