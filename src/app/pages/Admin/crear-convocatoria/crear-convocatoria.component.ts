import { Component, inject } from '@angular/core';
import { CardFormularioComponent } from '../../../core/shared/components/card-formulario/card-formulario.component';
import { dataCrearConvocatoria } from './const/data-crearConvocatoria.const';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-convocatoria',
  imports: [CardFormularioComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './crear-convocatoria.component.html',
  styleUrl: './crear-convocatoria.component.scss',
})
export class CrearConvocatoriaComponent {
  datos = dataCrearConvocatoria;

  form = inject(FormBuilder);
  formConvocatoria!: FormGroup;

  formularioConvocatoria() {
    this.formConvocatoria = this.form.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      slockTotal: ['', [Validators.required]],
      slockAvaible: ['', [Validators.required]],
      modality: ['', [Validators.required]],
      status: ['', [Validators.required]],
      dateStart: ['', [Validators.required]],
      dateEnd: ['', [Validators.required]],
    });
  }
}
