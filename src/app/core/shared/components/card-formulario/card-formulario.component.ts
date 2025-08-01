import { Component, input } from '@angular/core';
import { AppFloatingConfigurator } from '../../../../layout/component/app.floatingconfigurator';
import { cardFormulario } from './models/cardFormulario.type';
import { cardFormularioDataGeneric } from './const/cardFormularioGenericData.const';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-card-formulario',
  imports: [AppFloatingConfigurator, ToastModule, DialogModule],
  templateUrl: './card-formulario.component.html',
  styleUrl: './card-formulario.component.scss',
})
export class CardFormularioComponent {
  datos = input<cardFormulario>(cardFormularioDataGeneric);
}
