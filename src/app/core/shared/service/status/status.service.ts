import { Injectable } from '@angular/core';
import { ButtonSeverity } from 'primeng/button';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor() {}
  statusColor(status: string): ButtonSeverity {
    switch (status.toLowerCase()) {
      case 'abierta':
      case 'disponible':
        return 'success';
      case 'cerrada':
      case 'cupo lleno':
        return 'danger';
      case 'en revisión':
        return 'warn';
      case 'cancelada':
        return 'secondary';
      default:
        return 'primary';
    }
  }
}
