import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { facultie } from '../model/facultie.type';

@Injectable({
  providedIn: 'root',
})
export class FacultadesService {
  http = inject(HttpClient);
  api = environment.back;

  GetFacultades(
    page: number,
    status: string
  ): Observable<ContentResponsePaginated<facultie[]>> {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page);
    }
    if (status) {
      params = params.append('status', status);
    }
    return this.http
      .get<ContentResponsePaginated<facultie[]>>(`${this.api}/faculties`, {
        params,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }
  GetFacultad(id: string): Observable<ContentResponse<facultie>> {
    return this.http
      .get<ContentResponse<facultie>>(`${this.api}/faculties/${id}`)
      .pipe(catchError((error) => throwError(() => error)));
  }
  CreateFacultades(facultad: facultie): Observable<ContentResponse<facultie>> {
    return this.http
      .post<ContentResponse<facultie>>(`${this.api}/faculties`, facultad)
      .pipe(catchError((error) => throwError(() => error)));
  }
  ActivateFacultad(id: string): Observable<ContentResponse> {
    return this.http
      .patch<ContentResponse>(`${this.api}/faculties/${id}/activate`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }
  ArchivarFacultad(id: string): Observable<ContentResponse> {
    return this.http
      .patch<ContentResponse>(`${this.api}/faculties/${id}/archive`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }
  PatchFacultad(
    id: string,
    facultad: Partial<facultie>
  ): Observable<ContentResponse> {
    return this.http
      .patch<ContentResponse>(`${this.api}/faculties/${id}`, facultad)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
