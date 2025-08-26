import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { student } from '@core/shared/types/users/estudiante.type';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  http = inject(HttpClient);
  api = environment.back;
  url = `${this.api}/students`;

  GetStudents(
    page: number = 1,
    state?: string
  ): Observable<ContentResponsePaginated<student[]>> {
    let params = new HttpParams();
    if (page && page > 0) {
      params = params.append('page', page.toString());
    }
    if (state && state !== 'todos' && state.trim() !== '') {
      params = params.append('state', state);
    }
    console.log('consulta students');
    return this.http
      .get<ContentResponsePaginated<student[]>>(`${this.url}/get-all`, {
        params,
      })
      .pipe(
        catchError((error) => {
          console.error('Error al obtener estudiantes:', error);
          return throwError(() => error);
        })
      );
  }
}
