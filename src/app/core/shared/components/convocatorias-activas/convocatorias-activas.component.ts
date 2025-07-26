import { Component, inject, input, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { textConvocatoriasActivas } from './const/text.ConvocatoriasActivas.const';
import { convocatoriasData } from './data/data';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { convocatoria } from '../../types/convocatorias';
import { StatusService } from '../../service/status/status.service';

@Component({
  selector: 'app-convocatorias-activas',
  imports: [TagModule, ButtonModule],
  templateUrl: './convocatorias-activas.component.html',
  styleUrl: './convocatorias-activas.component.scss',
})
export class ConvocatoriasActivasComponent {
  convocatoria = input<convocatoria[] | []>(convocatoriasData);
  texto = textConvocatoriasActivas;
  statusService = inject(StatusService);

  statusColor(status: string): ButtonSeverity {
    return this.statusService.statusColor(status);
  }
}
