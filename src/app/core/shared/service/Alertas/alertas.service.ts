import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AlertasService {
  private messageService = inject(MessageService);

  showInfo(texto: string) {
    this.messageService.add({
      severity: 'info',
      summary: texto,
      detail: 'PrimeNG rocks',
    });
  }

  showWarn(texto: string = 'Advertencia') {
    this.messageService.add({
      severity: 'warn',
      summary: texto,
      detail: 'There are unsaved changes',
    });
  }

  showError(texto: string = 'Error') {
    this.messageService.add({
      severity: 'error',
      summary: texto,
      detail: 'Validation failed',
    });
  }
  showErrors(texto: string[]) {
    texto.forEach((e) => {
      this.messageService.add({
        severity: 'error',
        summary: e,
        detail: 'Validation failed',
      });
    });
  }

  showSuccess(texto: string = 'Éxito') {
    this.messageService.add({
      severity: 'success',
      summary: texto,
      detail: 'Message sent',
    });
  }
}
