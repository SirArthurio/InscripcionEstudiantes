import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { competencias } from '../model/competencias.type';

@Injectable({
  providedIn: 'root',
})
export class CompetenciasService {
  http = inject(HttpClient);
  api = environment.back;

  GetCompetencias(
    page: number,
    status: string
  ): Observable<ContentResponsePaginated<competencias[]>> {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page);
    }
    if (status) {
      params = params.append('status', status);
    }
    return this.http
      .get<ContentResponsePaginated<competencias[]>>(
        `${this.api}/competencies/get-all`,
        { params }
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
  GetCompetencia(id: string): Observable<ContentResponse<competencias>> {
    return this.http
      .get<ContentResponse<competencias>>(`${this.api}/competencies/get/${id}`)
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
}
