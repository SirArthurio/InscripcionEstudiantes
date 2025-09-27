import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ContentResponse,
  ContentResponsePaginated,
  professor,
} from '@core/shared/types';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  http = inject(HttpClient);
  api = environment.back;
  prefix = 'professors';

  GetProfessors(
    page: number,
    status: string
  ): Observable<ContentResponsePaginated<professor[]>> {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page);
    }
    if (status) {
      params = params.append('status', status);
    }
    return this.http
      .get<ContentResponsePaginated<professor[]>>(
        `${this.api}/${this.prefix}`,
        {
          params,
        }
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
  GetProfessor(id: string): Observable<ContentResponse<professor>> {
    return this.http
      .get<ContentResponse<professor>>(
        `${this.api}/${this.prefix}/${id}/get-by-id`
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
  PatchProfessor(
    id: string,
    professor: Partial<professor>
  ): Observable<ContentResponse<professor>> {
    return this.http
      .patch<ContentResponse<professor>>(
        `${this.api}/${this.prefix}/${id}`,
        professor
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  ActivateProfessor(id: string): Observable<ContentResponse<professor>> {
    return this.http
      .patch<ContentResponse<professor>>(
        `${this.api}/${this.prefix}/${id}/activate`,
        {}
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  DesactivateProfessor(id: string): Observable<ContentResponse<professor>> {
    return this.http
      .patch<ContentResponse<professor>>(
        `${this.api}/${this.prefix}/${id}/deactivate`,
        {}
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  CreateProfessors(
    professor: professor
  ): Observable<ContentResponse<professor>> {
    return this.http
      .post<ContentResponse<professor>>(`${this.api}/${this.prefix}`, professor)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
