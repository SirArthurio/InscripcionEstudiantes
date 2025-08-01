import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { programas } from '../../../../utils/const/index.const';

@Component({
  selector: 'app-curso-estudiante',
  imports: [SelectModule, ReactiveFormsModule],
  templateUrl: './curso-estudiante.component.html',
  styleUrl: './curso-estudiante.component.scss',
})
export class CursoEstudianteComponent {
  programas = programas;
}
