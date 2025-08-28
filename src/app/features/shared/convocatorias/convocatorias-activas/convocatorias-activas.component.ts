import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { TagModule } from 'primeng/tag';
import { textConvocatoriasActivas } from './const/text.ConvocatoriasActivas.const';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { convocatoriaDTO } from '../../../admin/convocatorias/model/convocatoriaDTO.type';
import { StatusService } from '@core/shared/service/status/status.service';
import { convocatoriasStore } from 'src/app/features/admin/convocatorias/store/convocatorias.store';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NoDataComponent } from '@core/shared/components/no-data/no-data.component';
import { statusConvocatorias } from '@core/shared/enums/status-convocatorias-type.enum copy';

@Component({
  selector: 'app-convocatorias-activas',
  imports: [TagModule, ButtonModule, NoDataComponent],
  templateUrl: './convocatorias-activas.component.html',
  styleUrl: './convocatorias-activas.component.scss',
})
export class ConvocatoriasActivasComponent implements OnInit {
  //store
  convocatoriaStore = inject(convocatoriasStore);
  //service
  statusService = inject(StatusService);
  alertService = inject(AlertasService);
  convocatoria = signal<convocatoriaDTO[]>([]);
  texto = textConvocatoriasActivas;
  filtradas = signal<convocatoriaDTO[]>([]);

  ngOnInit() {
    this.obtenerConvocatorias();
  }

  statusColor(status: string): ButtonSeverity {
    return this.statusService.statusColor(status);
  }

  async obtenerConvocatorias() {
    try {
      console.log('obtener');
      const response = await this.convocatoriaStore.getConvocatorias(
        1,
        'publicada'
      );
      if (!response) throw Error;
      console.log('data', response);
      this.convocatoria.set(response.data.page);
    } catch (error: HttpErrorResponse | any) {
      this.alertService.showErrors(error?.error?.message);
    }
  }

  getConvocatorias = effect(() => {
    this.filtradas.set(this.convocatoriasActivas(this.convocatoria()));
    console.log(this.filtradas());
  });

  convocatoriasActivas(
    convocatoras: convocatoriaDTO[] = []
  ): convocatoriaDTO[] {
    console.log('antes de filtrar', convocatoras);
    const abiertas = convocatoras.filter(
      (c) => c.status == statusConvocatorias.publicada
    );
    console.log('abiertas', abiertas);
    return abiertas;
  }
}
