import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { convocatoria } from '../crear-convocatoria/model/convocatoria.type';
import { convocatoriaDTO } from '../crear-convocatoria/model/convocatoriaDTO.type';

@Injectable({
  providedIn: 'root',
})
export class ConvocatoriasService {
  api = environment.back;
  prefix = 'calls-for-applications';
  url = `${this.api}/${this.prefix}/`;
  http = inject(HttpClient);

  CreateConvocatoria(
    convocatoria: convocatoria
  ): Observable<ContentResponse<convocatoria>> {
    return this.http
      .post<ContentResponse<convocatoria>>(`${this.url}create`, convocatoria)
      .pipe(catchError((error) => throwError(() => error)));
  }
  GetConvocatoria(): Observable<ContentResponse<convocatoriaDTO>> {
    return this.http
      .get<ContentResponse<convocatoriaDTO>>(`${this.url}`)
      .pipe(catchError((error) => throwError(() => error)));
  }
  GetConvocatorias(): Observable<ContentResponsePaginated<convocatoriaDTO[]>> {
    return this.http
      .get<ContentResponsePaginated<convocatoriaDTO[]>>(`${this.url}get-all`)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
