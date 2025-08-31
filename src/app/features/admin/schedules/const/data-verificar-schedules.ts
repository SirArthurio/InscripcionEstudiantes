import { professor } from '@core/shared/types';

export const datosProfessorVerificacion = (schedule: professor) => [
  {
    name: 'Nombre',
    content: schedule.firstName,
  },
  {
    name: 'Apellido',
    content: schedule.lastName,
  },
  {
    name: 'Numero Documento',
    content: schedule.documentNumber,
  },
  {
    name: 'Documento',
    content: schedule.documentType,
  },
  {
    name: 'Genero',
    content: schedule.gender,
  },
  {
    name: 'Lugar de nacimiento',
    content: schedule.birthPlace,
  },
  {
    name: 'Numero de Telefono',
    content: schedule.phone,
  },
  {
    name: 'Lugar de residencia',
    content: schedule.placeOfResidence,
  },
  {
    name: 'Especialidad',
    content: schedule.specialty,
  },
  {
    name: 'Email',
    content: schedule.user.institutionalEmail,
  },
];
