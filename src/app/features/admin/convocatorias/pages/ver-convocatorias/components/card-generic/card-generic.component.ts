import { Component, inject, input } from '@angular/core';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { convocatoriaDTO } from '../../../../model/convocatoriaDTO.type';
import { StatusService } from '@core/shared/service/status/status.service';
import { convocatoriasData } from 'src/app/features/shared/convocatorias/convocatorias-activas/data/data';
import { cardConvocatoriaText } from './model/card.convocatoria.type';
import { textConvocatoriaGeneric } from './const/text.card.convocatoria.const';
import {
  NoDataComponent,
  NoDataType,
} from '@core/shared/components/no-data/no-data.component';
import { Router } from '@angular/router';
import { convocatoriasStore } from '../../../../store/convocatorias.store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { statusCursos } from '@core/shared/enums/status-cursos-type.enum';
import { statusConvocatorias } from '@core/shared/enums/status-convocatorias-type.enum copy';

@Component({
  selector: 'convocatorias-card-generic',
  imports: [
    TagModule,
    ButtonModule,
    NoDataComponent,
    ConfirmDialog,
    ToastModule,
  ],
  templateUrl: './card-generic.component.html',
  styleUrl: './card-generic.component.scss',
})
export class ConvocatoriaCardGenericComponent {
  //store
  convocatoriaStore = inject(convocatoriasStore);
  //inputs
  type = input<NoDataType>('general');
  editarConvocatoria = input<boolean>(true);
  convocatoria = input<convocatoriaDTO[]>(convocatoriasData);
  texto = input<cardConvocatoriaText>(textConvocatoriaGeneric);
  //services
  statusService = inject(StatusService);
  router = inject(Router);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  statusConvocatoria = statusConvocatorias;
  statusColor(status: string): ButtonSeverity {
    return this.statusService.statusColor(status);
  }

  habilitar(status: string): boolean {
    if (status == 'Abierto' || status == 'Disponible') {
      return true;
    } else {
      return false;
    }
  }
  editar(convocatoria: convocatoriaDTO) {
    this.convocatoriaStore.setConvocatoria(convocatoria);
    this.router.navigate(['/admin/convocatorias/crear-convocatorias'], {
      queryParams: {
        convocatoriaId: convocatoria.id,
      },
    });
  }
  crearCompetencia(id: string) {
    this.router.navigate(['/admin/grupos/crear-grupos'], {
      queryParams: { convocatoria: id },
    });
  }
  competenciaConvocatoria(id: string) {
    this.router.navigate(['/admin/grupos/ver-grupos'], {
      queryParams: {
        convocatoria: id,
      },
    });
  }
  async publicarConvocatoria(id: string) {
    try {
      const response = await this.convocatoriaStore.publishConvocatoria(id);
      if (!response) throw Error;
      this.messageService.add({
        severity: 'info',
        summary: 'Confirmar',
        detail: 'Se Publico con Exito :D',
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'Algo ha salido mal, por favor intenta mas tarde :C',
        life: 3000,
      });

      throw error;
    }
  }
  cancelarConvocatoria(id: string) {}
  cerrarConvocatoria(id: string) {}
  accionActualizarTipo(nombre: string, id: string) {
    switch (nombre) {
      case 'publicar':
        this.publicarConvocatoria(id);
        break;
      case 'cancelar':
        this.cancelarConvocatoria(id);
        break;
      case 'cerrar':
        this.cerrarConvocatoria(id);
        break;
    }
  }
  confirmacion(event: Event, nombre: string, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Estas seguro de ${nombre} esta convocatoria?`,
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: `${nombre}`,
      },
      accept: () => {
        this.accionActualizarTipo(nombre, id);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'Eso Estuvo Cerca!',
          life: 3000,
        });
      },
    });
  }
}
