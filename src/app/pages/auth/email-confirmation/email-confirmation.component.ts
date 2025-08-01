import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { loginStore } from '../store/login.store';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { UnicesarValidator } from '@core/shared/Validators';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { CardFormularioComponent } from '@core/shared/components/card-formulario/card-formulario.component';

@Component({
  selector: 'app-email-confirmation',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    InputText,
    ToastModule,
    ConfirmDialog,
    Dialog,
    CardFormularioComponent,
  ],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.scss',
})
export default class EmailConfirmationComponent {
  //service
  confirmationService = inject(ConfirmationService);
  alertService = inject(AlertasService);
  errorFormService = inject(ErroesformService);
  messageService = inject(MessageService);
  //formulario
  form = inject(FormBuilder);
  formEmail!: FormGroup;
  loginStore = inject(loginStore);

  @Output() cerrar = new EventEmitter<void>();

  crearFomulario() {
    this.formEmail = this.form.group({
      institutionalEmail: ['', [Validators.required, UnicesarValidator()]],
    });
  }

  onSubmit() {
    if (this.formEmail.valid) {
      this.enviarDatos(this.formEmail.value);
    } else {
      this.alertService.showErrors(
        this.errorFormService.mostrarErroresFormulario(this.formEmail)
      );
      this.errorFormService.marcarFormularioError(this.formEmail);
    }
  }
  async enviarDatos(email: string) {
    const response = await this.loginStore.forgotPassword(email);
    this.alertService.showSuccess('Exito', `${response.message}`, 6000);
    this.formEmail.reset();
    this.cerrar.emit();
  }
  ngOnInit(): void {
    this.crearFomulario();
  }
  confirmar(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
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
