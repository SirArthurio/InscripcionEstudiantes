import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { programs } from '@core/shared/types/programas.type';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgramasService {
  http = inject(HttpClient);
  api = environment.back;

  GetProgramas(page: number): Observable<ContentResponsePaginated<programs[]>> {
    var params = new HttpParams();
    if (page) {
      params = params.append('page', page);
    }
    return this.http
      .get<ContentResponsePaginated<programs[]>>(`${this.api}/programs`, {
        params,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  GetProgramasByFacultad(
    page: number
  ): Observable<ContentResponsePaginated<programs[]>> {
    var params = new HttpParams();
    if (page) {
      params = params.append('page', page);
    }
    return this.http
      .get<ContentResponsePaginated<programs[]>>(`${this.api}/by-faculty`, {
        params,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  GetPrograma(id: number): Observable<ContentResponse<programs>> {
    return this.http
      .get<ContentResponse<programs>>(`${this.api}/programs/${id}`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }

  PatchPrograma(
    id: number,
    programa: Partial<programs>
  ): Observable<ContentResponse<programs>> {
    return this.http
      .patch<ContentResponse<programs>>(`${this.api}/programs/${id}`, programa)
      .pipe(catchError((error) => throwError(() => error)));
  }

  ActivateProgram(id: number): Observable<ContentResponse<programs>> {
    return this.http
      .patch<ContentResponse<programs>>(
        `${this.api}/programs/${id}/activate`,
        {}
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  ArchiveProgram(id: number): Observable<ContentResponse<programs>> {
    return this.http
      .patch<ContentResponse<programs>>(
        `${this.api}/programs/${id}/archive`,
        {}
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  CreateProgram(
    programa: programs,
    facultad: string
  ): Observable<ContentResponse<programs>> {
    return this.http
      .post<ContentResponse<programs>>(
        `${this.api}/programs/${facultad}`,
        programa
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
}
