import { Component, inject, input } from '@angular/core';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { convocatoriaDTO } from '../../../crear-convocatoria/model/convocatoriaDTO.type';
import { StatusService } from '@core/shared/service/status/status.service';
import { convocatoriasData } from 'src/app/pages/shared/convocatorias/convocatorias-activas/data/data';
import { cardConvocatoriaText } from './model/card.convocatoria.type';
import { textConvocatoriaGeneric } from './const/text.card.convocatoria.const';
import {
  NoDataComponent,
  NoDataType,
} from '@core/shared/components/no-data/no-data.component';

@Component({
  selector: 'convocatorias-card-generic',
  imports: [TagModule, ButtonModule, NoDataComponent],
  templateUrl: './card-generic.component.html',
  styleUrl: './card-generic.component.scss',
})
export class CardGenericComponent {
  //inputs
  type = input<NoDataType>('general');
  editarConvocatoria = input<boolean>(true);
  convocatoria = input<convocatoriaDTO[] | []>(convocatoriasData);
  texto = input<cardConvocatoriaText>(textConvocatoriaGeneric);
  //services
  statusService = inject(StatusService);

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
  editar(id: string) {}
}
