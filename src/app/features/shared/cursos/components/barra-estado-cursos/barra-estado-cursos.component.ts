import { Component, computed, effect, inject, input } from '@angular/core';
import { CartaComponent } from '../../../../../core/shared/components/carta/carta.component';
import { Knob } from 'primeng/knob';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-barra-estado-cursos',
  imports: [CartaComponent, Knob, ReactiveFormsModule],
  templateUrl: './barra-estado-cursos.component.html',
  styleUrl: './barra-estado-cursos.component.scss',
})
export class BarraEstadoCursosComponent {
  cursosActivos = input<number>(2);
  cursosCompletados = input<number>(2);
  convocatoriasInscritas = input<number>(1);
  form = inject(FormBuilder);
  formBarra!: FormGroup;

  calculoCompletado = computed(() => {
    if (this.cursosCompletados()) {
      return (this.cursosCompletados() * 100) / 5;
    } else return 0;
  });

  formularioBarra = effect(() => {
    this.formBarra = this.form.group({
      completado: this.calculoCompletado(),
    });
  });
}
