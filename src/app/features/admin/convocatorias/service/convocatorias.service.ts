import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { convocatoria } from '../model/convocatoria.type';
import { convocatoriaDTO } from '../model/convocatoriaDTO.type';
import { editConvocatoria } from '../pages/ver-convocatorias/components/card-generic/model/edit.convocatoria.type';

@Injectable({
  providedIn: 'root',
})
export class ConvocatoriasService {
  api = environment.back;
  prefix = 'calls-for-applications';
  url = `${this.api}/${this.prefix}`;
  http = inject(HttpClient);

  CreateConvocatoria(
    convocatoria: convocatoria
  ): Observable<ContentResponse<convocatoriaDTO>> {
    return this.http
      .post<ContentResponse<convocatoriaDTO>>(
        `${this.url}/create`,
        convocatoria
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  UpdateEnrollmentDatesConvocatoria(
    id: string,
    enrollmentStartDate: string,
    enrollmentEndDate: string
  ): Observable<ContentResponse<convocatoriaDTO>> {
    return this.http
      .patch<ContentResponse<convocatoriaDTO>>(
        `${this.url}/update-enrollment-dates/${id}`,
        { enrollmentStartDate, enrollmentEndDate }
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  UpdateInformationConvocatoria(
    id: string,
    edit: editConvocatoria
  ): Observable<ContentResponse<convocatoriaDTO>> {
    return this.http
      .patch<ContentResponse<convocatoriaDTO>>(`${this.url}/update/${id}`, edit)
      .pipe(catchError((error) => throwError(() => error)));
  }

  PublishConvocatoria(
    id: string
  ): Observable<ContentResponse<convocatoriaDTO>> {
    return this.http
      .patch<ContentResponse<convocatoriaDTO>>(`${this.url}/publish/${id}`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }

  CloseConvocatoria(
    id: string,
    name: string
  ): Observable<ContentResponse<convocatoriaDTO>> {
    return this.http
      .patch<ContentResponse<convocatoriaDTO>>(`${this.url}/close/${id}`, {
        name,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  CancelConvocatoria(id: string): Observable<ContentResponse<convocatoriaDTO>> {
    return this.http
      .patch<ContentResponse<convocatoriaDTO>>(`${this.url}/cancel/${id}`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }

  GetConvocatorias(
    page: number,
    status: string
  ): Observable<ContentResponsePaginated<convocatoriaDTO[]>> {
    console.log('peticion');
    let params = new HttpParams();
    if (page && page > 0) {
      params = params.append('page', page.toString());
    }
    if (status && status !== 'todos' && status.trim() !== '') {
      params = params.append('status', status);
    }
    return this.http
      .get<ContentResponsePaginated<convocatoriaDTO[]>>(`${this.url}/get-all`, {
        params,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }
  GetConvocatoria(
    convocatoriaId: string
  ): Observable<ContentResponse<convocatoriaDTO>> {
    return this.http
      .get<ContentResponse<convocatoriaDTO>>(
        `${this.url}/get-by-id/${convocatoriaId}`
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
}
