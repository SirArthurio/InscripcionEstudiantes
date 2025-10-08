import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { EscogerCursoComponent } from '../../components/escoger-curso/escoger-curso.component';
import { GrupoStore } from '../../store/grupo.store';
import { professorStore } from 'src/app/features/professor/store/professor.store';
import { Toast } from 'primeng/toast';
import { cursoDto } from '../../../cursos/models/cursoDto.type';
import { InputNumberModule } from 'primeng/inputnumber';
import { ModalCrearGrupoComponent } from '../../components/modal-crear-grupo/modal-crear-grupo.component';
import { DialogModule } from 'primeng/dialog';
import { GruposCreadosComponent } from '../../components/grupos-creados/grupos-creados.component';
import { cursosStore } from '../../../cursos/store/cursos.store';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-crear-grupos',
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ButtonModule,
    EscogerCursoComponent,
    Toast,
    InputNumberModule,
    ModalCrearGrupoComponent,
    DialogModule,
    GruposCreadosComponent,
    ChipModule,
    DividerModule,
    BadgeModule,
  ],
  templateUrl: './crear-grupos.component.html',
  styleUrl: './crear-grupos.component.scss',
})
export default class CrearGruposComponent implements OnInit {
  //service
  alertasService = inject(AlertasService);
  //stores
  cursoStore = inject(cursosStore);
  //variables
  grupoId = signal<string>('');
  cursoId = signal<string>('');
  convocatoriaId = signal<string>('');
  visibleGrupo = signal<boolean>(false);

  //injecciones
  router = inject(ActivatedRoute);
  grupoStore = inject(GrupoStore);
  professorStore = inject(professorStore);
  navegar = inject(Router);

  ngOnInit(): void {
    this.obtenerIdGrupo();
    this.obtenerIdConvocatoria();
  }
  ngOnDestroy(): void {
    this.grupoStore.resetGrupo();
  }
  obtenerIdGrupo() {
    const id = this.router.snapshot.queryParamMap.get('id');
    if (id) {
      this.grupoId.set(id);
      console.log('id grupo', this.grupoId());
    }
  }
  obtenerIdConvocatoria() {
    const id = this.router.snapshot.queryParamMap.get('convocatoria');
    if (id) {
      this.grupoStore.setConvocatoriaId(id);
      this.convocatoriaId.set(id);
    }
  }
  respuestaCursoAGrupo(event: { curso: cursoDto }) {
    console.log('llego este curso: ', event.curso);
    this.cursoId.set(event.curso.id!);
    this.showCrearGrupo();
  }
  showCrearGrupo() {
    console.log('abriendo');
    this.visibleGrupo.set(true);
  }
  cerrarCrearGrupo() {
    this.grupoStore.resetGrupo();
    this.visibleGrupo.set(false);
  }
  volver() {
    this.navegar.navigate(['/admin/convocatorias/crear-convocatorias'], {
      queryParams: {
        convocatoriaId: this.convocatoriaId(),
      },
    });
  }
  crear() {
    this.navegar.navigate(['/admin/convocatorias/crear-convocatorias']);
  }
}
