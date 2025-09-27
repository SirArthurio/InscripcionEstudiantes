import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { student } from '@core/shared/types/users/estudiante.type';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
interface institutionalEmail {
  institutionalEmail: string;
}
@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  http = inject(HttpClient);
  api = environment.back;
  url = `${this.api}/students`;

  GetStudents(
    page: number = 1,
    status?: string
  ): Observable<ContentResponsePaginated<student[]>> {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page.toString());
    }
    if (status) {
      params = params.append('status', status);
    }
    console.log('consulta students');
    return this.http
      .get<ContentResponsePaginated<student[]>>(`${this.url}`, {
        params,
      })
      .pipe(
        catchError((error) => {
          console.error('Error al obtener estudiantes:', error);
          return throwError(() => error);
        })
      );
  }
  VerifyInstitucionalEmail(token: string): Observable<ContentResponse> {
    let params = new HttpParams();
    if (token) {
      params = params.set('institutional-email-verification', token);
    }

    return this.http
      .patch<ContentResponse>(
        `${this.url}/institutional-email-verification`,
        null,
        {
          params,
        }
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
  SendInstitucionalEmail(
    email: institutionalEmail
  ): Observable<ContentResponse> {
    return this.http
      .post<ContentResponse>(
        `${this.url}/send-institutional-email-verification`,
        email
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
  RestoreStudent(id: string): Observable<ContentResponse> {
    return this.http
      .patch<ContentResponse>(`${this.url}/${id}/restore`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }
  DeleteStudent(id: string): Observable<ContentResponse> {
    return this.http
      .patch<ContentResponse>(`${this.url}/${id}/delete`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }
  PatchStudent(id: string): Observable<ContentResponse> {
    return this.http
      .patch<ContentResponse>(`${this.url}/${id}`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }
}
