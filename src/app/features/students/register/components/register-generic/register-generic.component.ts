import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardFormularioComponent } from '../../../../../core/shared/components/card-formulario/card-formulario.component';
import { dataRegisterGeneric } from '../../const/data-register.const';
import { cardFormulario } from '@core/shared/components/card-formulario/models/cardFormulario.type';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-register-generic',
  imports: [
    ToastModule,
    ButtonModule,
    MessageModule,
    CommonModule,
    SelectModule,
    InputNumberModule,
    RouterLink,
    CardFormularioComponent,
    ConfirmDialog,
  ],
  templateUrl: './register-generic.component.html',
  styleUrl: './register-generic.component.scss',
})
export class RegisterGenericComponent {
  data = input<cardFormulario>(dataRegisterGeneric);
  formulario = output();
  enviarFormulario() {
    this.formulario.emit();
  }
}
