import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateFormatterService {
  static formatter = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  static getDDMMMMYYYY(date: Date | string): string {
    const parsedDate = date instanceof Date ? date : new Date(date);

    if (isNaN(parsedDate?.getTime())) {
      return 'formato o fecha invalida';
    }

    return this.formatter.format(parsedDate);
  }
  static createLocalDate(dateString: string | null | undefined): Date | null {
    if (!dateString || typeof dateString !== 'string') {
      console.warn(
        'dateString is null, undefined, or not a string:',
        dateString
      );
      return null;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      console.warn('dateString is not in YYYY-MM-DD format:', dateString);
      return null;
    }

    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month - 1 porque Date usa 0-11
  }

  static convertToHHmmss(time: string): string {
    if (!time) return '';

    // Verificar si ya tiene el formato correcto HH:mm:ss
    if (time.includes(':') && time.split(':').length === 3) {
      return time;
    }

    // Verificar si tiene formato HH:mm
    if (time.includes(':') && time.split(':').length === 2) {
      return `${time}:00`;
    }

    // Si no tiene el formato esperado, devolver vacío o manejar error
    console.warn(`Formato de tiempo inválido: ${time}`);
    return '';
  }
}
