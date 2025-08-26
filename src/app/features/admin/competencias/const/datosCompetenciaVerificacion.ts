import { competencias } from '../model/competencias.type';

export const datosCompetenciaVerificacion = (competencia: competencias) => [
  {
    name: 'Codigo',
    content: competencia.code,
  },
  {
    name: 'Nombre',
    content: competencia.name,
  },
  {
    name: 'Descripcion',
    content: competencia.description,
  },
];
