import { inject, Injectable } from '@angular/core';
import { grupo } from '../model/grupo.type';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ContentResponsePaginated, ContentResponse } from '@core/shared/types';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GrupoService {
  http = inject(HttpClient);
  api = environment.back;

  GetGrupos(
    page: number,
    status: string
  ): Observable<ContentResponsePaginated<grupo[]>> {
    let params = new HttpParams();
    if (status) {
      params = params.append('status', status);
    }
    if (page) {
      params = params.append('page', page);
    }
    return this.http
      .get<ContentResponsePaginated<grupo[]>>(`${this.api}/groups/get-all`, {
        params,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  GetGrupo(id: string): Observable<ContentResponse<grupo>> {
    return this.http
      .get<ContentResponse<grupo>>(`${this.api}/groups/get/${id}`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  CreateGrupo(grupo: grupo): Observable<ContentResponse<grupo>> {
    return this.http
      .post<ContentResponse<grupo>>(`${this.api}/groups/create/`, grupo)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
