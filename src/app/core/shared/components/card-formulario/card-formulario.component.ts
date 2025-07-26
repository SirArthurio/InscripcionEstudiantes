import { Component, input, signal } from '@angular/core';
import { AppFloatingConfigurator } from '../../../../layout/component/app.floatingconfigurator';
interface cardFormulario {
  title: string;
  description: string;
}
@Component({
  selector: 'app-card-formulario',
  imports: [AppFloatingConfigurator],
  templateUrl: './card-formulario.component.html',
  styleUrl: './card-formulario.component.scss',
})
export class CardFormularioComponent {
  datos = input<cardFormulario | null>();
}
