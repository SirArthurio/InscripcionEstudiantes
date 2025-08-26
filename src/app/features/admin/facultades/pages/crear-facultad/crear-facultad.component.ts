import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardFormularioValidacionComponent } from '@core/shared/components/card-formulario-validacion/card-formulario-validacion.component';
import { CardFormularioValidacion } from '@core/shared/components/card-formulario-validacion/model/cardFormValidacion.type';
import { datosResumen } from '@core/shared/components/card-formulario-validacion/model/datosResumen.type';
import { CartaComponent } from '@core/shared/components/carta/carta.component';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { DateFormatterService } from '@core/shared/service/DateFormatter/date-formatter.service';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputText } from 'primeng/inputtext';
import { ValidationClassDirective } from '@core/directives/app-validation-class.directive';
import { longitudExactaValidator } from '@core/shared/Validators/RangeValidator.type';
import { UnicesarValidator } from '@core/shared/Validators';
import { facultie } from '../../model/facultie.type';
import { facultadStore } from '../../store/facultad.store';
import { datosFacultadVerificacion } from '../../const/datosFacultadVerificacion';
import { dataCrearFacultad } from '../../const/data-crearFacultad.const';
import { dataVerFacultad } from '../../const/data-verFacultad.const';
import { SoloNumerosDirective } from '@core/directives/solo-numeros.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentResponse } from '@core/shared/types';

@Component({
  selector: 'app-crear-facultad',
  imports: [
    Button,
    CartaComponent,
    CardFormularioValidacionComponent,
    ReactiveFormsModule,
    CommonModule,
    ConfirmDialog,
    InputText,
    ValidationClassDirective,
    SoloNumerosDirective,
  ],
  templateUrl: './crear-facultad.component.html',
  styleUrl: './crear-facultad.component.scss',
})
export default class CrearFacultadComponent implements OnInit, OnDestroy {
  //service
  alertasService = inject(AlertasService);
  erroresFormService = inject(ErroesformService);
  dateFormatterService = inject(DateFormatterService);

  //signals
  validacionData = signal<datosResumen[] | []>([]);
  progress = signal<number>(0);

  //formulario
  form = inject(FormBuilder);
  formFacultad!: FormGroup;

  //injecciones
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  facultadStore = inject(facultadStore);
  router = inject(ActivatedRoute);
  navigate = inject(Router);

  //variables
  isEditar = signal(false);
  datos = signal<CardFormularioValidacion>(dataCrearFacultad);
  minDate: Date = new Date();
  facultad = signal<facultie | null>(null);
  idFacultad = signal<string | null>(null);

  ngOnInit(): void {
    this.obtenerIdFacultad();
    this.formularioConvocatoria();
  }
  ngOnDestroy(): void {
    this.newExtension.reset();
    this.formFacultad.reset();
    this.facultadStore.resetFacultades();
    this.facultad.set(null);
  }

  private obtenerIdFacultad() {
    const id = this.router.snapshot.queryParamMap.get('id');
    if (id) {
      this.idFacultad.set(id);
    }
  }
  getfacultades = effect(async () => {
    if (this.idFacultad()) {
      const response = await this.getFacultad();
      if (response) {
        this.isEditar.set(true);
        this.datos.set(dataVerFacultad);
      } else {
        this.isEditar.set(false);
        this.datos.set(dataCrearFacultad);
      }
    }
  });
  private async getFacultad(): Promise<ContentResponse<facultie>> {
    try {
      const response = await this.facultadStore.getFacultad(this.idFacultad()!);
      if (!response) throw Error;
      this.facultad.set(response.data);
      this.setDatos();
      return response;
    } catch (error) {
      throw error;
    }
  }

  private setDatos() {
    const { extensions, ...otrosDatos } = this.facultad()!;

    this.formFacultad.patchValue(otrosDatos);

    this.extension.clear();

    if (extensions && Array.isArray(extensions)) {
      extensions.forEach((ext: string) => {
        if (ext && ext.trim()) {
          this.extension.push(
            this.form.control(ext.trim(), Validators.required)
          );
        }
      });
    }

    if (this.extension.length === 0) {
      this.extension.push(this.form.control('', Validators.required));
    }
  }
  crearPrograma() {
    this.navigate.navigate(['/admin/programas/crear-programas'], {
      queryParams: {
        facultad: this.facultad()?.id,
      },
    });
  }

  private siguiente() {
    if (this.progress() < 1) {
      this.progress.update((current) => current + 1);
    }
  }

  private formularioConvocatoria() {
    this.formFacultad = this.form.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, longitudExactaValidator(10)]],
      extensions: this.form.array([], [Validators.required]),
      address: ['', [Validators.required]],
      email: ['', [Validators.required, UnicesarValidator()]],
    });
  }
  newExtension = this.form.control('', Validators.required);
  get extension() {
    return this.formFacultad.get('extensions') as FormArray;
  }

  agregarExtension() {
    if (this.newExtension.valid) {
      const newextension = this.newExtension.value;
      this.extension.push(this.form.control(newextension, Validators.required));
      this.newExtension.reset();
    }
  }
  eliminarExtension(index: number) {
    if (this.extension.length > 0) {
      this.extension.removeAt(index);
    }
  }

  nuevaConvocatoria() {
    this.formFacultad.reset();
    this.newExtension.reset();
    this.progress.set(0);
  }

  resumenDatos(facultad: facultie) {
    this.validacionData.set(datosFacultadVerificacion(facultad));
    this.alertasService.showSuccess(
      'Registrado!',
      'Se registro la Facultad :D'
    );
    this.siguiente();
  }

  async enviarDatos(facultad: facultie) {
    try {
      const response = await this.facultadStore.createFacultad(facultad);
      if (!response) {
        throw Error;
      }
      this.resumenDatos(response.data);
    } catch (error: HttpErrorResponse | any) {
      this.alertasService.showError(error.error.message);
      throw error;
    }
  }

  erroresForm() {
    this.erroresFormService.marcarFormularioError(this.formFacultad);
    this.alertasService.showErrors(
      this.erroresFormService.mostrarErroresFormulario(this.formFacultad)
    );
  }

  onSubmit() {
    if (this.formFacultad.invalid) {
      this.erroresForm();
    } else {
      this.enviarDatos(this.formFacultad.value);
    }
  }

  tipoDeAccion() {
    if (this.isEditar()) {
      this.isEditar();
      console.log('editar');
    } else {
      this.confirm1();
    }
  }

  confirm1() {
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
