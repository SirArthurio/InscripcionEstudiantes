import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { textIntitucionalEmail } from './const/text-send-institucional-email.const';
import { StudentsService } from '../../students/service/students.service';

@Component({
  selector: 'app-send-institucional-email',
  imports: [
    DialogModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
  ],
  templateUrl: './send-institucional-email.component.html',
  styleUrl: './send-institucional-email.component.scss',
})
export default class SendInstitucionalEmailComponent {
  //input
  show = input<boolean>(false);
  emailReceive = input<string>('');
  //service
  confirmationService = inject(ConfirmationService);
  alertService = inject(AlertasService);
  errorFormService = inject(ErroesformService);
  messageService = inject(MessageService);
  //store
  studentService = inject(StudentsService);
  //texto
  texto = textIntitucionalEmail;
  //variables
  visible!: boolean;
  email = signal<string>('');
  @Output() cerrar = new EventEmitter<void>();
  ver = effect(() => {
    this.visible = this.show();
  });
  confirmado() {
    console.log('confirmado');
    this.email.set(this.emailReceive().concat('@unicesar.edu.co'));
    this.enviarDatos(this.email());
  }
  async enviarDatos(email: string) {
    const institutionalEmail = { institutionalEmail: email };
    const response = await firstValueFrom(
      this.studentService.SendInstitucionalEmail(institutionalEmail)
    );
    this.alertService.showSuccess('Exito', `${response.message}`, 6000);
    this.visible = false;
    this.cerrar.emit();
  }
}
