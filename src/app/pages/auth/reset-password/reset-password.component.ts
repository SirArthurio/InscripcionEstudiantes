import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { loginStore } from '../store/login.store';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { Password } from 'primeng/password';
import { CardFormularioComponent } from '@core/shared/components/card-formulario/card-formulario.component';
import { Button } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Password,
    CardFormularioComponent,
    Button,
    ConfirmDialog,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export default class ResetPasswordComponent implements OnInit {
  //service
  confirmationService = inject(ConfirmationService);
  alertService = inject(AlertasService);
  errorFormService = inject(ErroesformService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  //formulario
  form = inject(FormBuilder);
  formForgot!: FormGroup;
  //store
  loginStore = inject(loginStore);
  //signal
  token = signal<string>('');

  crearFomulario() {
    this.formForgot = this.form.group({
      passwordVerificacion: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  convertirDatos(): string {
    const { password } = this.formForgot.value;
    return password;
  }
  validarDatos(): boolean {
    const { password, passwordVerificacion } = this.formForgot.value;
    if (password === passwordVerificacion) {
      return true;
    } else {
      return false;
    }
  }
  antesDeEnviar() {
    if (this.validarDatos()) {
      this.enviarDatos(this.convertirDatos());
    } else {
      this.alertService.showError('Las contraseñas deben ser iguales!');
    }
  }
  onSubmit() {
    if (this.formForgot.valid) {
      this.antesDeEnviar();
    } else {
      this.alertService.showErrors(
        this.errorFormService.mostrarErroresFormulario(this.formForgot)
      );
      this.errorFormService.marcarFormularioError(this.formForgot);
    }
  }
  async enviarDatos(password: string) {
    try {
      const response = await this.loginStore.resetPassword(
        password,
        this.token()
      );
      if (!response) throw Error;
      this.alertService.showSuccess(
        'Exito',
        'Se reestablecio su contraseña :D'
      );
    } catch (error: HttpErrorResponse | any) {
      this.alertService.showError(error?.message);
    }
  }
  ngOnInit(): void {
    this.crearFomulario();

    this.route.queryParamMap.subscribe((query) => {
      const reset_token = query.get('reset_token');
      this.token.set(reset_token || '');
    });
  }
  confirmar(event: Event) {
    this.confirmationService.confirm({
      message: 'Estas seguro de continuar? Verifica los datos!',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        this.onSubmit();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }
}
