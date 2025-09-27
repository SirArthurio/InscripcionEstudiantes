import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  output,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { Calendar, CalendarOptions } from '@fullcalendar/core/index.js';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DialogModule } from 'primeng/dialog';
import { daySchedule } from '@core/shared/types';
import { ConfirmationService, MessageService } from 'primeng/api';
import interactionPlugin from '@fullcalendar/interaction';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-schedules',
  imports: [
    DialogModule,
    FullCalendarModule,
    ButtonModule,
    TagModule,
    CommonModule,
  ],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss',
})
export class SchedulesComponent {
  visible = input<boolean>(false);
  editSchedules = input<daySchedule[]>([]);
  calendarOptions!: CalendarOptions;
  visibleChange = output();
  @Output() confirmedSchedules = new EventEmitter<daySchedule[]>();
  eliminarSchedulePadre = output<number>();

  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;

  calendarApi = signal<Calendar | null>(null);
  hoursSelected = signal<daySchedule[]>([]);
  confirmVisible = signal<boolean>(false);
  isEditMode = signal<boolean>(false);

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  ngOnInit() {
    this.initializeCalendar();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.calendarComponent) {
        this.calendarApi.set(this.calendarComponent.getApi());
        console.log('Calendar API inicializado');
      }
    }, 100);
  }

  private initializeCalendar() {
    this.calendarOptions = {
      initialView: 'timeGridWeek',
      plugins: [interactionPlugin, timeGridPlugin],
      locale: esLocale,
      height: '100%',
      slotMinTime: '06:00:00',
      slotMaxTime: '22:00:00',
      weekends: true,
      selectable: true,
      selectMirror: true,
      allDaySlot: false,
      headerToolbar: false,
      titleFormat: { year: undefined, month: undefined, day: undefined },
      dayHeaderFormat: { weekday: 'long' },
      events: [],
      select: (info) => {
        this.handleTimeSelection(info.start, info.end);
        const api = this.calendarApi();
        if (api) {
          api.unselect();
        }
      },
      eventClick: (info) => {
        if (this.isEditMode()) {
          this.removeSchedule(info.event);
        } else {
          this.removeSchedule(info.event);
        }
      },
    };
  }

  editEffect = effect(
    () => {
      const schedules = this.editSchedules();

      if (schedules && schedules.length > 0) {
        if (!this.isEditMode()) {
          this.isEditMode.set(true);
        }
        if (!this.areSchedulesEqual(schedules, this.hoursSelected())) {
          this.loadEditSchedules(schedules);
        }
      } else {
        if (this.isEditMode()) {
          this.isEditMode.set(false);
          this.clearCalendar();
        }
      }
    },
    { allowSignalWrites: true }
  );

  onDialogShow() {
    console.log('Dialog mostrado');
    setTimeout(() => {
      const api = this.calendarApi();
      if (api) {
        try {
          api.updateSize();
          api.render();
          console.log('Calendario redimensionado');
        } catch (e) {
          console.warn('Error al redimensionar calendario:', e);
        }
      }
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }

  onVisibleChange(value: boolean) {
    this.visibleChange.emit();
    if (!value) {
      this.resetCalendar();
    }
  }

  private loadEditSchedules(datos: daySchedule[]) {
    console.log('Cargando schedules para edición:', datos);
    const schedules = datos.map((e) => e);

    const api = this.calendarApi();
    if (!api) {
      console.warn('API no disponible para cargar schedules');
      return;
    }

    api.removeAllEvents();

    this.hoursSelected.set([...schedules]);

    schedules.forEach((schedule, index) => {
      api.addEvent({
        id: `existing-${index}-${schedule.day}-${schedule.startTime}`,
        title: `Clase (${schedule.day})`,
        daysOfWeek: [this.dayNumber(schedule.day)],
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
        allDay: false,
        className: 'existing-schedule',
        extendedProps: {
          scheduleData: schedule,
          isExisting: true,
        },
      });
    });

    this.refreshCalendarSize();
  }

  private handleTimeSelection(start: Date, end: Date) {
    console.log('Manejando selección de tiempo:', { start, end });

    if (this.isEditMode()) {
      this.messageService.add({
        severity: 'info',
        summary: 'Modo edición',
        detail: 'Haz clic en un horario existente para eliminarlo',
        life: 3000,
      });
      return;
    }

    this.addSchedule(start, end);
  }

  private addSchedule(start: Date, end: Date) {
    const day = this.dayName(start);
    const startTime = this.formatTime(start);
    const endTime = this.formatTime(end);

    console.log('Intentando agregar schedule:', { day, startTime, endTime });
    if (this.hoursSelected().length >= 2) {
      this.messageService.add({
        severity: 'info',
        summary: 'No se pueden Agregar mas de 2 Horarios :C',
        life: 2000,
      });
      return;
    }
    const currentSchedules = this.hoursSelected();
    const hasConflict = currentSchedules.some(
      (schedule) =>
        schedule.day === day &&
        this.hasTimeConflict(
          startTime,
          endTime,
          schedule.startTime,
          schedule.endTime
        )
    );

    if (hasConflict) {
      this.showConflictDialog();
      return;
    }

    const newSchedule: daySchedule = { day, startTime, endTime };

    this.hoursSelected.update((current) => {
      const updated = [...current, newSchedule];
      console.log('Actualizando hoursSelected:', updated);
      return updated;
    });

    const api = this.calendarApi();
    if (api) {
      const eventId = `new-${Date.now()}-${day}-${startTime}`;
      api.addEvent({
        id: eventId,
        title: 'Clase',
        daysOfWeek: [this.dayNumber(day)],
        startTime,
        endTime,
        backgroundColor: this.randomColor(),
        borderColor: '#000',
        allDay: false,
        className: 'new-schedule',
        extendedProps: {
          scheduleData: newSchedule,
          isExisting: false,
        },
      });

      console.log('Evento agregado al calendario con ID:', eventId);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Horario agregado',
      detail: `${day} de ${startTime} a ${endTime}`,
      life: 2000,
    });
  }

  private removeSchedule(event: any) {
    const scheduleData = event.extendedProps?.scheduleData;

    if (!scheduleData) {
      console.warn('No se encontró scheduleData en el evento');
      return;
    }

    console.log('Removiendo schedule:', scheduleData);

    this.hoursSelected.update((current) => {
      const filtered = current.filter(
        (schedule) =>
          !(
            schedule.day === scheduleData.day &&
            schedule.startTime === scheduleData.startTime &&
            schedule.endTime === scheduleData.endTime
          )
      );
      console.log('Schedules después de remover:', filtered);
      return filtered;
    });

    event.remove();

    this.messageService.add({
      severity: 'info',
      summary: 'Horario eliminado',
      detail: `${scheduleData.day} de ${scheduleData.startTime} a ${scheduleData.endTime}`,
      life: 2000,
    });
  }

  private hasTimeConflict(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    return !(end1 <= start2 || start1 >= end2);
  }

  openConfirmation() {
    console.log('Abriendo confirmación, schedules:', this.hoursSelected());

    if (this.hoursSelected().length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin horarios',
        detail: 'Debe seleccionar al menos un horario',
        life: 3000,
      });
      return;
    }

    this.confirmVisible.set(true);
  }

  cancelar() {
    console.log('Cancelando y limpiando calendario');
    this.resetCalendar();
  }

  saveHorarios() {
    const schedulesToSave = [...this.hoursSelected()];
    console.log('Guardando horarios:', schedulesToSave);

    if (schedulesToSave.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'No hay horarios para guardar',
        life: 3000,
      });
      return;
    }

    this.confirmedSchedules.emit(schedulesToSave);

    this.messageService.add({
      severity: 'success',
      summary: 'Horarios guardados',
      detail: `Se guardaron ${schedulesToSave.length} horarios correctamente`,
      life: 3000,
    });

    this.confirmVisible.set(false);
    this.onVisibleChange(false);
  }

  private resetCalendar() {
    console.log('Reseteando calendario');

    const api = this.calendarApi();
    if (api) {
      api.removeAllEvents();
    }

    this.hoursSelected.set([]);
    this.confirmVisible.set(false);

    if (!this.editSchedules()?.length) {
      this.isEditMode.set(false);
    }
  }
  removeScheduleByIndex(index: number) {
    console.log('Removiendo schedule en índice:', index);

    const currentSchedules = this.hoursSelected();
    this.eliminarSchedulePadre.emit(index);
    if (index < 0 || index >= currentSchedules.length) {
      console.warn('Índice inválido:', index);
      return;
    }

    const scheduleToRemove = currentSchedules[index];
    console.log('Schedule a remover:', scheduleToRemove);

    this.hoursSelected.update((current) =>
      current.filter((_, i) => i !== index)
    );

    const api = this.calendarApi();
    if (api) {
      const events = api.getEvents();

      const eventToRemove = events.find((event) => {
        const eventData = event.extendedProps?.['scheduleData'];
        return (
          eventData &&
          eventData.day === scheduleToRemove.day &&
          eventData.startTime === scheduleToRemove.startTime &&
          eventData.endTime === scheduleToRemove.endTime
        );
      });

      if (eventToRemove) {
        eventToRemove.remove();
        console.log('Evento removido del calendario:', eventToRemove.id);
      } else {
        console.warn('No se encontró el evento en el calendario para remover');
      }
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Horario eliminado',
      detail: `${scheduleToRemove.day} de ${scheduleToRemove.startTime} a ${scheduleToRemove.endTime}`,
      life: 2000,
    });
    this.confirmedSchedules.emit(this.hoursSelected());
    console.log('Schedules restantes:', this.hoursSelected());
  }

  private clearCalendar() {
    console.log('Limpiando calendario');
    const api = this.calendarApi();
    if (api) {
      api.removeAllEvents();
    }
    this.hoursSelected.set([]);
  }

  private refreshCalendarSize() {
    const api = this.calendarApi();
    if (!api) return;

    setTimeout(() => {
      try {
        api.updateSize();
        api.render();
      } catch (e) {
        console.warn('Error al refrescar tamaño del calendario', e);
      }
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }

  private randomColor() {
    const colors = [
      '#1abc9c',
      '#3498db',
      '#9b59b6',
      '#e67e22',
      '#e74c3c',
      '#2ecc71',
      '#f39c12',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private dayName(date: Date): string {
    const days = [
      'domingo',
      'lunes',
      'martes',
      'miercoles',
      'jueves',
      'viernes',
      'sabado',
    ];
    return days[date.getDay()];
  }

  private dayNumber(dayName: string): number {
    const dayMap: Record<string, number> = {
      domingo: 0,
      lunes: 1,
      martes: 2,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sabado: 6,
    };
    return dayMap[dayName];
  }

  private areSchedulesEqual(
    schedules1: daySchedule[],
    schedules2: daySchedule[]
  ): boolean {
    if (schedules1.length !== schedules2.length) return false;
    return schedules1.every((s1) =>
      schedules2.some(
        (s2) =>
          s1.day === s2.day &&
          s1.startTime === s2.startTime &&
          s1.endTime === s2.endTime
      )
    );
  }

  private showConflictDialog() {
    this.confirmationService.confirm({
      message: 'El horario seleccionado se superpone con uno existente.',
      header: 'Conflicto de Horarios',
      icon: 'pi pi-exclamation-triangle',
      acceptVisible: false,
      rejectVisible: false,
    });
  }

  debugState() {
    console.log('=== ESTADO DEL CALENDARIO ===');
    console.log('visible:', this.visible());
    console.log('isEditMode:', this.isEditMode());
    console.log('hoursSelected:', this.hoursSelected());
    console.log('editSchedules input:', this.editSchedules());
    console.log('confirmVisible:', this.confirmVisible());

    const api = this.calendarApi();
    if (api) {
      const events = api.getEvents();
      console.log('Eventos en calendario:', events.length);
      events.forEach((event: any) => {
        console.log('- Evento:', {
          id: event.id,
          title: event.title,
          daysOfWeek: event.extendedProps?.daysOfWeek,
          startTime: event.extendedProps?.startTime,
          endTime: event.extendedProps?.endTime,
        });
      });
    } else {
      console.log('API del calendario no disponible');
    }
    console.log('============================');
  }
}
