import { inject, Injectable } from '@angular/core';
import { curso } from '../models/curso.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ContentResponsePaginated, ContentResponse } from '@core/shared/types';
import { environment } from '@environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { cursoDto } from '../models/cursoDto.type';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  http = inject(HttpClient);
  api = environment.back;
  prefix = 'courses';

  GetCursos(
    page?: number,
    status?: string
  ): Observable<ContentResponsePaginated<cursoDto[]>> {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page);
    }
    if (status) {
      params = params.append('status', status);
    }

    return this.http
      .get<ContentResponsePaginated<cursoDto[]>>(`${this.api}/${this.prefix}`, {
        params,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  // GetCursosCompetencias(
  //   idCompetencia: string,
  //   page?: number,
  //   status?: string
  // ): Observable<ContentResponsePaginated<cursoDto[]>> {
  //   let params = new HttpParams();
  //   if (page) {
  //     params = params.append('page', page);
  //   }
  //   if (status) {
  //     params = params.append('status', status);
  //   }

  //   return this.http
  //     .get<ContentResponsePaginated<cursoDto[]>>(
  //       `${this.api}/courses/get-all-by-competency/${idCompetencia}`,
  //       {
  //         params,
  //       }
  //     )
  //     .pipe(catchError((error) => throwError(() => error)));
  // }

  GetCurso(id: string): Observable<ContentResponse<cursoDto>> {
    return this.http
      .get<ContentResponse<cursoDto>>(`${this.api}/courses/${id}/get-by-id`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  CreateCursos(curso: curso): Observable<ContentResponse<curso>> {
    return this.http
      .post<ContentResponse<curso>>(`${this.api}/courses`, curso)
      .pipe(catchError((error) => throwError(() => error)));
  }
  PatchCurso(
    id: string,
    curso: Partial<cursoDto>
  ): Observable<ContentResponse<cursoDto>> {
    return this.http
      .patch<ContentResponse<cursoDto>>(`${this.api}/courses/${id}`, curso)
      .pipe(catchError((error) => throwError(() => error)));
  }

  ActivarCurso(id: string): Observable<ContentResponse<cursoDto>> {
    return this.http
      .patch<ContentResponse<cursoDto>>(
        `${this.api}/courses/${id}/activate`,
        {}
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  ArchivarCurso(id: string): Observable<ContentResponse<cursoDto>> {
    return this.http
      .patch<ContentResponse<cursoDto>>(`${this.api}/courses/${id}/archive`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }
}
