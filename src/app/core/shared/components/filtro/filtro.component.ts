import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filtro',
  imports: [],
  templateUrl: './filtro.component.html',
  styleUrl: './filtro.component.scss',
})
export class FiltroComponent {
  paramName = input.required<string>();
  router = inject(Router);

  buscar(paramName: string) {
    this.router.navigate([], { queryParams: { paramName } });
  }
}
