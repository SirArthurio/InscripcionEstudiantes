import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { enrollment } from '../model/enrollment-type';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  http = inject(HttpClient);
  api = environment.back;
  url = `${this.api}/enrollments`;

  GetStudents(
    page: number = 1,
    state?: string
  ): Observable<ContentResponsePaginated<enrollment[]>> {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page.toString());
    }
    if (state && state !== 'todos' && state.trim() !== '') {
      params = params.append('state', state);
    }
    return this.http
      .get<ContentResponsePaginated<enrollment[]>>(`${this.url}`, {
        params,
      })
      .pipe(
        catchError((error) => {
          console.error('Error al obtener estudiantes:', error);
          return throwError(() => error);
        })
      );
  }

  GetEnrollmentStudentByGroup(
    groupId: string
  ): Observable<ContentResponse<enrollment>> {
    let params = new HttpParams().set('groupId', groupId);
    return this.http
      .get<ContentResponse<enrollment>>(`${this.url}/by-group`, { params })
      .pipe(catchError((error) => throwError(() => error)));
  }

  GetEnrollmentStudentByConvoatoria(
    studentId: string,
    status: string,
    callId: string
  ): Observable<ContentResponse<enrollment>> {
    let params = new HttpParams()
      .set('studentId', studentId)
      .set('status', status)
      .set('callId', callId);
    return this.http
      .get<ContentResponse<enrollment>>(`${this.url}/by-call-stundent`, {
        params,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  CancelarEnrollment(id: string): Observable<ContentResponse> {
    return this.http
      .patch<ContentResponse>(`${this.url}/${id}/cancel`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }

  Matricular(enrollment: enrollment): Observable<ContentResponse<enrollment>> {
    return this.http
      .post<ContentResponse<enrollment>>(`${this.url}/create`, enrollment)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener estudiantes:', error);
          return throwError(() => error);
        })
      );
  }
}
