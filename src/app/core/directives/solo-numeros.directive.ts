// solo-numeros.directive.ts
import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[SoloNumeros]',
  standalone: true, // 🔥 Angular 15+ (incluyendo 19)
})
export class SoloNumerosDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const valueFiltrado = input.value.replace(/[^0-9]/g, '');

    // Reemplaza en el DOM
    input.value = valueFiltrado;

    // Reemplaza en el FormControl (Angular forms)
    if (this.ngControl.control) {
      this.ngControl.control.setValue(valueFiltrado, { emitEvent: false });
    }
  }
}
