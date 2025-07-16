import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function UnicesarValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@unicesar\.edu\.co$/;

    if (!email) return null;

    return emailRegex.test(email) ? null : { unicesarEmail: true };
  };
}
