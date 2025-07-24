import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appValidationClass]',
})
export class ValidationClassDirective implements OnInit, OnDestroy {
  @Input('appValidationClass') controlName!: string;

  statusChangeSub?: Subscription;

  constructor(
    private ngControl: NgControl,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (!this.ngControl) return;

    this.statusChangeSub = this.ngControl.statusChanges?.subscribe(() => {
      const control = this.ngControl.control;
      if (control?.invalid && (control.dirty || control.touched)) {
        this.renderer.addClass(this.el.nativeElement, 'ng-invalid');
        this.renderer.addClass(this.el.nativeElement, 'ng-dirty');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'ng-invalid');
        this.renderer.removeClass(this.el.nativeElement, 'ng-dirty');
      }
    });
  }

  ngOnDestroy() {
    this.statusChangeSub?.unsubscribe();
  }
}
