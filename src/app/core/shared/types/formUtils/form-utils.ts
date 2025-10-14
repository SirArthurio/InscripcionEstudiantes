import { AbstractControl, ValidationErrors, FormGroup, FormArray, ValidatorFn } from "@angular/forms";

export class FormUtils {
    //Las expresiones regulares
    static emailPattern = '^[a-zA-Z0-9._%+-]+@unicesar\\.edu\\.co$';
    static phonePattern = '^[0-9]{10}$';

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
                    delete matchingControl.errors['passwordsNotEqual'];
                    if (Object.keys(matchingControl.errors).length === 0) {
                        matchingControl.setErrors(null);
                    }
                }
                return null;
            }
        }
    }

    static getTextError(errors: ValidationErrors){
        for (const key of Object.keys(errors)) {
     switch (key) {
       case 'required':
          return 'Este campo es requerido'
       case 'minlength':
         return `Campo de mínimo de ${errors['minlength'].requiredLength} caracteres.`
       case 'min':
         return `Valor mínimo de ${errors['min'].min}`
        case 'unicesarEmail':
         return `Debe ser un correo institucional`
       case 'emailTaken':
          return `El correo electronico ya esta tomado`
        case 'notUser':
          return `El usuario ya esta tomado`
        case 'passwordsNotEqual':
            return 'Las contraseñas no coinciden';
        case 'longitudInvalida':
            return 'El número debe tener exactamente 10 dígitos'
        default:
            return 'Error de validacion no controlado'
        }

    }
    return null
    }



    static isValidField(form: AbstractControl, fieldName: string): boolean | null {
      if (!(form instanceof FormGroup)) return null;
      const control = form.get(fieldName);
      return !!control?.errors && control.touched;
    }

    static getFieldError(form: AbstractControl, fieldName: string): string | null {
      if (!(form instanceof FormGroup)) return null;
      const control = form.get(fieldName);
      if (!control) return null;

      const errors = control.errors ?? {};
      return FormUtils.getTextError(errors);
    }




  static getFiedlArrayError(form: FormArray, index: number): string | null {
    if (form.controls.length ===0) return null;

   const errors = form.controls[index].errors ?? {};

   return FormUtils.getTextError(errors)
  }



  static isValidFieldInArray(FormArray: FormArray, index: number){
    return(
      FormArray.controls[index].errors && FormArray.controls[index].touched
    )
  }


  

  static async checkingServerResponse(control: AbstractControl):Promise< ValidationErrors|null >{

    const formValue=control.value

    if(formValue==='hola@mundo.com'){
      return {
        emailTaken: true
      }
    }
    
    return null
  }

}