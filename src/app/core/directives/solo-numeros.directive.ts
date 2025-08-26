// solo-numeros.directive.ts
import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[SoloNumeros]',
  standalone: true,
})
export class SoloNumerosDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const valueFiltrado = input.value.replace(/[^0-9]/g, '');

    input.value = valueFiltrado;

    if (this.ngControl.control) {
      this.ngControl.control.setValue(valueFiltrado, { emitEvent: false });
    }
  }
}
