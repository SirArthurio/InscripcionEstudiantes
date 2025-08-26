import { inject, Injectable } from '@angular/core';
import { curso } from '../models/curso.type';
import { HttpClient } from '@angular/common/http';
import { ContentResponsePaginated, ContentResponse } from '@core/shared/types';
import { environment } from '@environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  http = inject(HttpClient);
  api = environment.back;

  GetCursos(
    page?: string,
    status?: string,
    idCompetencia?: string
  ): Observable<ContentResponsePaginated<curso[]>> {
    return this.http
      .get<ContentResponsePaginated<curso[]>>(`${this.api}/courses/get-all`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  CreateCursos(
    curso: curso,
    competencia: string
  ): Observable<ContentResponse<curso>> {
    return this.http
      .post<ContentResponse<curso>>(
        `${this.api}/courses/create/${competencia}`,
        curso
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
}
