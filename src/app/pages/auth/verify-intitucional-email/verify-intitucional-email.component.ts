import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { firstValueFrom } from 'rxjs';
import ErrorComponent from '@core/shared/pages/error/error.component';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ErrorComponent],
  templateUrl: './verify-intitucional-email.component.html',
  styleUrl: './verify-intitucional-email.component.scss',
})
export default class VerifyInstitucionalComponent implements OnInit {
  //service
  confirmationService = inject(ConfirmationService);
  alertService = inject(AlertasService);
  errorFormService = inject(ErroesformService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  loginService = inject(AuthService);

  //signal
  token = signal<string>('');
  succes = signal<boolean>(false);

  @Input() userEmail?: string;
  @Input() userName?: string = 'Estudiante';
  @Input() institutionName?: string = 'Universidad Popular del Cesar';
  @Input() showNextSteps = true;
  @Input() showCelebration = true;
  @Input() autoRedirect = false;
  @Input() redirectDelay = 5000;

  @Output() onContinue = new EventEmitter<string>();
  @Output() onSetupProfile = new EventEmitter<void>();
  @Output() onGoToDashboard = new EventEmitter<void>();

  showConfetti = false;
  countdown = 0;

  async enviarDatos() {
    try {
      const response = await firstValueFrom(
        this.loginService.VerifyInstitucionalEmail(this.token())
      );
      if (!response) {
        this.succes.set(false);
        throw Error;
      }
      this.alertService.showSuccess('Exito', 'Se Verifico tu correo :D');
      this.succes.set(true);
    } catch (error: HttpErrorResponse | any) {
      this.succes.set(false);

      this.alertService.showError(error?.message);
    }
  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((query) => {
      const verify = query.get('verify-email-token');
      this.token.set(verify || '');
    });
    console.log(this.token());
    this.enviarDatos();
  }

  get displayEmail(): string {
    if (!this.userEmail) return '';
    const [local, domain] = this.userEmail.split('@');
    if (local.length <= 4) return this.userEmail;
    return `${local.substring(0, 2)}***@${domain}`;
  }
}
