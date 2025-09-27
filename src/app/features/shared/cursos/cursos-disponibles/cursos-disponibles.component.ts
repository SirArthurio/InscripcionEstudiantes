import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { textCrusosDisponibles } from './const/text.cursos-disponibles';
import { cursosDisponiblesMock } from './data/data';
import { StatusService } from '../../../../core/shared/service/status/status.service';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GrupoStore } from 'src/app/features/admin/grupos/store/grupo.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { grupoDto } from 'src/app/features/admin/grupos/model/grupoDto.type';
import { ConfirmationService, MessageService } from 'primeng/api';
import { loginStore } from 'src/app/features/auth/store/auth.store';
import { CurrentStore } from 'src/app/features/auth/store/current.store';
import { EnrollmentStore } from '../../enrollment/store/enrollment.store';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-cursos-disponibles',
  imports: [
    TagModule,
    ButtonModule,
    TitleCasePipe,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './cursos-disponibles.component.html',
  styleUrl: './cursos-disponibles.component.scss',
})
export class CursosDisponiblesComponent implements OnInit {
  //inputs
  //store
  grupoStore = inject(GrupoStore);
  authStore = inject(CurrentStore);
  enrollmentStore = inject(EnrollmentStore);
  //injecciones
  router = inject(ActivatedRoute);
  navegar = inject(Router);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  //servicios
  statusService = inject(StatusService);
  paginationService = inject(PaginationService);
  //variables
  gruposDisponibles = signal<grupoDto[]>([]);
  texto = textCrusosDisponibles;
  convocatoriaId = signal<string>('');
  currentPage = signal<number>(1);

  ngOnInit(): void {
    this.obtenerConvocatoriaId();
  }
  obtenerConvocatoriaId() {
    const id = this.router.snapshot.queryParamMap.get('convocatoriaId');
    if (id) {
      this.convocatoriaId.set(id);
      console.log('id', id);
    }
  }
  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });
  filtrarGrupos(grupos: grupoDto[]): grupoDto[] {
    return grupos.filter((e) => e.status == 'abierto');
  }

  obtenerGrupos = injectQuery(() => ({
    queryKey: ['grupos', this.convocatoriaId(), this.currentPage()],
    queryFn: async () => {
      try {
        const response = await this.grupoStore.getGruposPorConvocatoriaStudent(
          this.currentPage(),
          this.convocatoriaId(),
          'asd'
        );
        this.gruposDisponibles.set(response.data);
        console.log('data', response);
        return this.filtrarGrupos(response.data);
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));

  statusColor(status: string): ButtonSeverity {
    return this.statusService.statusColor(status);
  }

  private matricular(grupoId: string) {
    console.log('id grupo:', grupoId);
    const id = this.authStore.student()?.id;
    if (id) {
      try {
        const response = this.enrollmentStore.matricular({
          studentId: id,
          groupId: grupoId,
        });
        if (!response) throw Error;
        this.messageService.add({
          severity: 'success',
          summary: 'Aceptado',
          detail: `se Matriculo con Exito! :D`,
          life: 3000,
        });
      } catch (error: any) {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: `se presento un error :C ${error.error.message}`,
          life: 3000,
        });
        throw error;
      }
    }
  }
  confirmacionMatricula(grupoId: string) {
    this.confirmationService.confirm({
      message: `Estas seguro de matricular este curso?`,
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: {
        label: 'Aceptar',
      },
      rejectButtonProps: {
        label: 'Cancelar',
      },
      rejectVisible: true,
      accept: () => {
        this.matricular(grupoId);
      },
    });
  }
  // cursosDisponibles(cursos: cursoDisponible[]) {
  //   if (cursos) {
  //     const filtro = cursos.filter((e) => e.availableSeats > 0);
  //     this.gruposDisponibles.set(filtro);
  //   }
  // }
}
