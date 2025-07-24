import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function longitudExactaValidator(longitud: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toString();
    return value && value.length === longitud
      ? null
      : { longitudInvalida: true };
  };
}

export function documentNumberValidator(
  minimo: number,
  maximo: number
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toString();

    if (!value) return null;

    const length = value.length;
    return length >= minimo && length <= maximo
      ? null
      : {
          longitudInvalida: {
            actual: length,
            requeridoMin: minimo,
            requeridoMax: maximo,
          },
        };
  };
}
