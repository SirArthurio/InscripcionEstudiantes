import { Component, effect, inject, signal } from '@angular/core';
import { CardGenericComponent } from './components/card-generic/card-generic.component';
import { PaginationComponent } from '@core/shared/components/pagination/pagination.component';
import { textVerConvocatorias } from './const/textVerConvocatorias.const';
import { convocatoriaDTO } from '../crear-convocatoria/model/convocatoriaDTO.type';
import { convocatoriasStore } from '../store/convocatorias.store';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ver-convocatorias',
  imports: [CardGenericComponent, PaginationComponent],
  templateUrl: './ver-convocatorias.component.html',
  styleUrl: './ver-convocatorias.component.scss',
})
export default class VerConvocatoriasComponent {
  totalPaginas = signal<number>(2);
  convocatorias = signal<convocatoriaDTO[]>([]);
  //store
  convocatoriaStore = inject(convocatoriasStore);
  //service
  alertaService = inject(AlertasService);
  text = textVerConvocatorias;

  async getConvocatorias() {
    try {
      const response = await this.convocatoriaStore.getConvocatorias();
      if (!response) throw Error;
      this.convocatoriaStore.setConvocatorias(response.data.page);
    } catch (error: any | HttpErrorResponse) {
      this.alertaService.showError(error.message);
    }
  }
  setconvocatorias = effect(() => {
    this.getConvocatorias();
    this.convocatorias.set(this.convocatoriaStore.convocatorias());
  });
}
