import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { competencias } from '../model/competencias.type';
import { competenciaDto } from '../model/competenciaDto.type';

@Injectable({
  providedIn: 'root',
})
export class CompetenciasService {
  http = inject(HttpClient);
  api = environment.back;

  GetCompetencias(
    page: number,
    status: string
  ): Observable<ContentResponsePaginated<competenciaDto[]>> {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page);
    }
    if (status) {
      params = params.append('status', status);
    }
    return this.http
      .get<ContentResponsePaginated<competenciaDto[]>>(
        `${this.api}/competencies/get-all`,
        { params }
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
  GetCompetencia(id: string): Observable<ContentResponse<competenciaDto>> {
    return this.http
      .get<ContentResponse<competenciaDto>>(
        `${this.api}/competencies/get-by-id/${id}`
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
  CreateCompetencias(
    facultad: competencias
  ): Observable<ContentResponse<competencias>> {
    return this.http
      .post<ContentResponse<competencias>>(
        `${this.api}/competencies/create`,
        facultad
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
  ActivarCompetencia(id: string): Observable<ContentResponse<competenciaDto>> {
    return this.http
      .patch<ContentResponse<competenciaDto>>(
        `${this.api}/competencies/activate/${id}`,
        {}
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  ArchivarCompetencia(id: string): Observable<ContentResponse<competenciaDto>> {
    return this.http
      .patch<ContentResponse<competenciaDto>>(
        `${this.api}/competencies/archive/${id}`,
        {}
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
}
