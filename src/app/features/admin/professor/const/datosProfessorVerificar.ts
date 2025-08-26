import { professor } from '@core/shared/types';

export const datosProfessorVerificacion = (professor: professor) => [
  {
    name: 'Nombre',
    content: professor.name,
  },
  {
    name: 'Apellido',
    content: professor.lastName,
  },
  {
    name: 'Numero Documento',
    content: professor.documentNumber,
  },
  {
    name: 'Documento',
    content: professor.documentType,
  },
  {
    name: 'Genero',
    content: professor.gender,
  },
  {
    name: 'Lugar de nacimiento',
    content: professor.birthPlace,
  },
  {
    name: 'Numero de Telefono',
    content: professor.phone,
  },
  {
    name: 'Lugar de residencia',
    content: professor.placeOfResidence,
  },
  {
    name: 'Especialidad',
    content: professor.specialty,
  },
  {
    name: 'Email',
    content: professor.user.institutionalEmail,
  },
];
