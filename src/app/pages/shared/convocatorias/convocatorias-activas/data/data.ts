import { convocatoriaDTO } from '../../../../Admin/convocatorias/crear-convocatoria/model/convocatoriaDTO.type';

export const convocatoriasData: convocatoriaDTO[] = [
  {
    code: 'cv002',
    status: 'Abierta',
    title: 'Competencia de Lectura Crítica',
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    modality: 'presencial',
    description:
      'Convocatoria para estudiantes interesados en fortalecer habilidades de comprensión lectora, análisis de textos y pensamiento crítico, basada en los lineamientos del ICFES.',
  },
  {
    code: 'cv002',
    status: 'Cerrada',
    title: 'Curso de Razonamiento Cuantitativo',
    startDate: '2025-06-10',
    endDate: '2025-07-10',
    modality: 'presencial',

    description:
      'Curso enfocado en desarrollar la competencia matemática y lógica en el contexto de problemas cotidianos y académicos. Nivel intermedio.',
  },
  {
    code: 'cv002',
    status: 'En revisión',
    title: 'Convocatoria: Inglés como Lengua Extranjera',
    startDate: '2025-07-15',
    endDate: '2025-07-30',
    modality: 'presencial',

    description:
      'Se busca conformar un grupo de estudiantes para actividades intensivas en comprensión lectora y auditiva en inglés, con énfasis en estructuras gramaticales clave del examen Saber Pro.',
  },
  {
    code: 'cv002',
    status: 'Abierta',
    title: 'Curso de Competencias Ciudadanas',
    startDate: '2025-08-05',
    endDate: '2025-09-05',
    modality: 'presencial',

    description:
      'Convocatoria abierta para estudiantes universitarios interesados en ética, participación ciudadana y resolución pacífica de conflictos. Alineado con las competencias genéricas evaluadas por el ICFES.',
  },
  {
    code: 'cv002',
    status: 'Cancelada',
    title: 'Curso PreSaber para Ingeniería',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    modality: 'presencial',

    description:
      'Curso cancelado por baja inscripción. Estaba orientado a estudiantes de ingeniería que se preparaban para las competencias genéricas y específicas de Saber TyT.',
  },
];
