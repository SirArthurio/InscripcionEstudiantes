import { Component, input, OnInit, output, signal } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { CardFormularioValidacion } from './model/cardFormValidacion.type';
import { datosResumen } from './model/datosResumen.type';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CartaComponent } from '../carta/carta.component';
import { subTitle } from './const/subTitle.const';

@Component({
  selector: 'app-card-formulario-validacion',
  imports: [StepsModule, ToastModule, ButtonModule, RouterLink, CartaComponent],
  templateUrl: './card-formulario-validacion.component.html',
  styleUrl: './card-formulario-validacion.component.scss',
})
export class CardFormularioValidacionComponent implements OnInit {
  items: MenuItem[] | undefined;
  data = input<CardFormularioValidacion>();
  subTitle = subTitle;
  validacionData = input<datosResumen[]>();
  constructor(public messageService: MessageService) {}
  progress = input<number>(0);
  nuevaAccion = output<void>();

  subTitulo(): string {
    const elemento = this.subTitle.find(
      (element) => element.id === this.progress()
    );
    return elemento ? elemento.content : '';
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Rellene los campos',
        command: (event: any) =>
          this.messageService.add({
            severity: 'info',
            summary: 'First Step',
            detail: event.item.label,
          }),
      },
      {
        label: 'Resumen',
        command: (event: any) =>
          this.messageService.add({
            severity: 'info',
            summary: 'Second Step',
            detail: event.item.label,
          }),
      },
    ];
  }
  nuevoFormulario() {
    this.nuevaAccion.emit();
  }
}
