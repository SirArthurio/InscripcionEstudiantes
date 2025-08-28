import { inject, Injectable } from '@angular/core';
import { grupo } from '../model/grupo.type';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ContentResponsePaginated, ContentResponse } from '@core/shared/types';
import { Observable, catchError, throwError } from 'rxjs';
import { grupoDto } from '../model/grupoDto.type';

@Injectable({
  providedIn: 'root',
})
export class GrupoService {
  http = inject(HttpClient);
  api = environment.back;

  GetGruposPorConvocatoria(
    page: number,
    idConvocatoria: string
  ): Observable<ContentResponse<grupoDto[]>> {
    let params = new HttpParams();

    if (page) {
      params = params.append('page', page);
    }
    return this.http
      .get<ContentResponse<grupoDto[]>>(
        `${this.api}/groups/get-by-call/${idConvocatoria}`,
        {
          params,
        }
      )
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
