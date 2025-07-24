import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VerificacionFechasLimiteService {
  constructor() {}

  VerificacionMayor16Edad(): string {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 16);
    return hoy.toISOString().split('T')[0];
  }
  VerificacionNoMayorHoy(): string {
    return new Date().toISOString().split('T')[0];
  }
  VerificacionMayorDeEdad(): string {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18);
    return hoy.toISOString().split('T')[0];
  }
  VerificacionMenor80Edad(): string {
    const min = new Date();
    min.setFullYear(min.getFullYear() - 80);
    return min.toISOString().split('T')[0];
  }
}
