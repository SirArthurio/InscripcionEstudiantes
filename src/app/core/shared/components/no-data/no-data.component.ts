import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';
export type NoDataType =
  | 'students'
  | 'courses'
  | 'grades'
  | 'assignments'
  | 'books'
  | 'reports'
  | 'calendar'
  | 'messages'
  | 'general';

interface NoDataConfig {
  title: string;
  message: string;
  character: string;
  characterName: string;
  actionText?: string;
  tips: string[];
}
@Component({
  selector: 'app-no-data',
  imports: [CommonModule],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss',
})
export class NoDataComponent {
  type = input<NoDataType>('general');
  @Input() customTitle?: string;
  @Input() customMessage?: string;
  @Input() showTips = true;
  @Input() showAction = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  private configs: Record<NoDataType, NoDataConfig> = {
    students: {
      title: '¡Aún no hay estudiantes registrados!',
      message:
        'Parece que tu aula virtual está esperando a sus primeros alumnos. ¡Es hora de comenzar esta aventura educativa!',
      character: '👨‍🏫',
      characterName: 'Profesor Sakai',
      actionText: 'Agregar estudiantes',
      tips: [
        'Importa estudiantes desde un archivo CSV',
        'Invita estudiantes por email',
        'Crea perfiles manualmente',
      ],
    },
    courses: {
      title: '¡No hay cursos disponibles!',
      message:
        'Tu biblioteca de conocimiento está lista para llenarse. ¡Comencemos creando tu primer curso!',
      character: '📚',
      characterName: 'Bibliotecaria Luna',
      actionText: 'Crear curso',
      tips: [
        'Define objetivos claros de aprendizaje',
        'Organiza el contenido por módulos',
        'Incluye actividades interactivas',
      ],
    },
    grades: {
      title: '¡No hay calificaciones registradas!',
      message:
        'El libro de calificaciones está esperando los primeros logros de tus estudiantes.',
      character: '🦉',
      characterName: 'Búho Sabio',
      actionText: 'Registrar calificaciones',
      tips: [
        'Establece criterios de evaluación claros',
        'Proporciona retroalimentación constructiva',
        'Celebra los logros de tus estudiantes',
      ],
    },
    assignments: {
      title: '¡No hay tareas asignadas!',
      message:
        'Es momento de desafiar a tus estudiantes con actividades emocionantes y educativas.',
      character: '🎯',
      characterName: 'Capitán Tarea',
      actionText: 'Crear tarea',
      tips: [
        'Diseña tareas relevantes y prácticas',
        'Establece fechas límite realistas',
        'Incluye instrucciones claras',
      ],
    },
    books: {
      title: '¡La biblioteca está vacía!',
      message:
        'Los estantes están esperando ser llenados con recursos educativos increíbles.',
      character: '📖',
      characterName: 'Libro Mágico',
      actionText: 'Agregar recursos',
      tips: [
        'Incluye variedad de formatos (PDF, videos, enlaces)',
        'Organiza por categorías temáticas',
        'Actualiza regularmente el contenido',
      ],
    },
    reports: {
      title: '¡No hay reportes generados!',
      message:
        'Los datos están esperando ser analizados para generar insights valiosos sobre el aprendizaje.',
      character: '📊',
      characterName: 'Analista Data',
      actionText: 'Generar reporte',
      tips: [
        'Revisa el progreso regularmente',
        'Identifica patrones de aprendizaje',
        'Toma decisiones basadas en datos',
      ],
    },
    calendar: {
      title: '¡No hay eventos programados!',
      message:
        'Tu calendario académico está listo para organizarse con actividades educativas emocionantes.',
      character: '📅',
      characterName: 'Calendario Inteligente',
      actionText: 'Programar evento',
      tips: [
        'Planifica con anticipación',
        'Incluye recordatorios automáticos',
        'Coordina horarios con estudiantes',
      ],
    },
    messages: {
      title: '¡No hay mensajes nuevos!',
      message:
        'Tu bandeja de entrada está tranquila. ¡Perfecto momento para la comunicación proactiva!',
      character: '💌',
      characterName: 'Mensajero Express',
      actionText: 'Enviar mensaje',
      tips: [
        'Mantén comunicación regular con estudiantes',
        'Responde dudas oportunamente',
        'Comparte actualizaciones importantes',
      ],
    },
    general: {
      title: '¡No hay datos disponibles!',
      message:
        'Esta sección está esperando ser poblada con información valiosa para tu experiencia educativa.',
      character: '🎓',
      characterName: 'Graduado Exitoso',
      actionText: 'Comenzar',
      tips: [
        'Explora las diferentes funcionalidades',
        'Personaliza tu experiencia',
        '¡No dudes en experimentar!',
      ],
    },
  };

  get config(): NoDataConfig {
    return this.configs[this.type()];
  }

  get displayTitle(): string {
    return this.customTitle || this.config.title;
  }

  get displayMessage(): string {
    return this.customMessage || this.config.message;
  }

  onTipClick(tip: string) {
    console.log(`Tip clicked: ${tip}`);
  }
}
