import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import esLocale from '@fullcalendar/core/locales/es';

import interactionPlugin from '@fullcalendar/interaction';
import { convocatoriasData } from '../convocatorias/convocatorias-activas/data/data';
interface convocatorias {
  title: string;
  start: string;
  end: string;
}
@Component({
  selector: 'app-calendario',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FullCalendarModule, ProgressSpinnerModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss',
})
export default class CalendarioComponent implements OnInit {
  cdrf = inject(ChangeDetectorRef);
  cursos = convocatoriasData;
  eventos = signal<convocatorias[] | []>([]);
  hoy = new Date().toISOString().split('T')[0];
  ready = false;
  calendarOptions!: CalendarOptions;
  ngOnInit() {
    this.cargarEventos();
  }

  getEventosProximos(): convocatorias[] {
    console.log('entro al eventos');
    return this.cursos
      .filter((date) => date.endDate !== undefined && date.endDate >= this.hoy)
      .map((e) => ({
        title: e.title,
        start: e.startDate,
        end: this.sumarUnDia(e.endDate as string),
      }));
  }
  sumarUnDia(fecha: string): string {
    const d = new Date(fecha);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }
  cargarEventos() {
    const eventosOriginales = this.getEventosProximos();
    const colores = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'];
    const eventosConColor = eventosOriginales.map((evento, i) => ({
      ...evento,
      backgroundColor: colores[i % colores.length],
      borderColor: colores[i % colores.length],
      textColor: 'white',
    }));
    this.eventos.set(eventosConColor);
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: this.eventos(),
      locale: esLocale,
    };

    this.ready = true;
  }
}
