import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
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
  static isFieldOneEquialFieldTwo(field: string, field2: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(field);
      const matchingControl = formGroup.get(field2);
      if (!control || !matchingControl) return null;
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordsNotEqual: true });
        return { passwordsNotEqual: true };
      } else {
        if (matchingControl.errors) {
          delete matchingControl.errors['Las contraseñas no son iguales!'];
          if (Object.keys(matchingControl.errors).length === 0) {
            matchingControl.setErrors(null);
          }
        }
        return null;
      }
    };
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
