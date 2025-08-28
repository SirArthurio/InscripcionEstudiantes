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

  GetProgramas(): Observable<ContentResponsePaginated<programs[]>> {
    return this.http
      .get<ContentResponsePaginated<programs[]>>(`${this.api}/programs/get-all`)
      .pipe(catchError((error) => throwError(() => error)));
  }
  CreateProgram(
    programa: programs,
    facultad: string
  ): Observable<ContentResponse<programs>> {
    return this.http
      .post<ContentResponse<programs>>(
        `${this.api}/programs/create/${facultad}`,
        programa
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
}
