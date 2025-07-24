import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ErroesformService {
  constructor() {}

  marcarFormularioError(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsDirty();
      control.markAsTouched();
      if ((control as FormGroup).controls) {
        this.marcarFormularioError(control as FormGroup);
      }
    });
  }

  mostrarErroresFormulario(form: FormGroup): string[] {
    const errores: string[] = [];

    Object.keys(form.controls).forEach((campo) => {
      const control = form.get(campo);
      if (control && control.invalid && (control.dirty || control.touched)) {
        const controlErrors = control.errors;
        if (controlErrors) {
          Object.keys(controlErrors).forEach((error) => {
            errores.push(`El campo "${campo}" tiene el error: ${error}`);
          });
        }
      }
    });

    return errores;
  }
}
