import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { schedule } from '../model/schedule.type';
import { catchError, Observable, throwError } from 'rxjs';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';

@Injectable({
  providedIn: 'root',
})
export class SchedulesService {
  http = inject(HttpClient);
  api = environment.back;
  prefix = 'schedules';

  CreateSchedule(schedule: schedule): Observable<ContentResponse<schedule>> {
    return this.http
      .post<ContentResponse<schedule>>(`${this.api}/${this.prefix}`, schedule)
      .pipe(catchError((error) => throwError(() => error)));
  }

  ObtenerSchedules(): Observable<ContentResponsePaginated<schedule[]>> {
    return this.http
      .get<ContentResponsePaginated<schedule[]>>(`${this.api}/${this.prefix}`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  ObtenerSchedule(id: string): Observable<ContentResponse<schedule>> {
    return this.http
      .get<ContentResponse<schedule>>(`${this.api}/${this.prefix}/${id}`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  ObtenerSchedulesStudent(
    studentId: string,
    callId: string
  ): Observable<ContentResponse<schedule>> {
    const params = new HttpParams()
      .set('studentId', studentId)
      .set('callId', callId);

    return this.http
      .get<ContentResponse<schedule>>(
        `${this.api}/${this.prefix}/by-call-student`,
        { params }
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  ObtenerSchedulesProfessor(
    professorId: string,
    callId: string
  ): Observable<ContentResponse<schedule>> {
    const params = new HttpParams()
      .set('professorId', professorId)
      .set('callId', callId);

    return this.http
      .get<ContentResponse<schedule>>(
        `${this.api}/${this.prefix}/by-call-professor`,
        { params }
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
}
