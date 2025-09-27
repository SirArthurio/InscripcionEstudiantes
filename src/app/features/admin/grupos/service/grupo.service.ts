import { inject, Injectable } from '@angular/core';
import { grupo } from '../model/grupo.type';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ContentResponsePaginated, ContentResponse } from '@core/shared/types';
import { Observable, catchError, throwError } from 'rxjs';
import { grupoDto } from '../model/grupoDto.type';
import { schedule } from '../../schedules/model/schedule.type';

@Injectable({
  providedIn: 'root',
})
export class GrupoService {
  http = inject(HttpClient);
  api = environment.back;

  GetGruposPorConvocatoriaStudent(
    page: number,
    idConvocatoria: string,
    studentId: string
  ): Observable<ContentResponse<grupoDto[]>> {
    let params = new HttpParams();

    if (page) {
      params = params.append('page', page);
    }
    params = params.append('callId', idConvocatoria);
    params = params.append('studentId', studentId);
    return this.http
      .get<ContentResponse<grupoDto[]>>(
        `${this.api}/groups/get-by-call-student`,
        {
          params,
        }
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
  GetGruposPorConvocatoriaProfessor(
    page: number,
    idConvocatoria: string,
    professorId: string
  ): Observable<ContentResponse<grupoDto[]>> {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page);
    }
    params = params.append('callId', idConvocatoria);
    params = params.append('professorId', professorId);
    return this.http
      .get<ContentResponse<grupoDto[]>>(
        `${this.api}/groups/get-by-call-professor/${idConvocatoria}`,
        {
          params,
        }
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  GetGrupo(id: string): Observable<ContentResponse<grupoDto>> {
    return this.http
      .get<ContentResponse<grupoDto>>(`${this.api}/groups/${id}`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  GetGrupos(callId: string): Observable<ContentResponse<grupoDto[]>> {
    var params = new HttpParams().set('callId', callId);
    return this.http
      .get<ContentResponse<grupoDto[]>>(`${this.api}/groups`, {
        params,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }
  CreateGrupo(grupo: grupo): Observable<ContentResponse<grupoDto>> {
    return this.http
      .post<ContentResponse<grupoDto>>(`${this.api}/groups`, grupo)
      .pipe(catchError((error) => throwError(() => error)));
  }

  AbrirGrupo(id: string): Observable<ContentResponse<grupoDto>> {
    return this.http
      .patch<ContentResponse<grupoDto>>(`${this.api}/groups/${id}/open`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }

  CancelarGrupo(id: string): Observable<ContentResponse<grupoDto>> {
    return this.http
      .patch<ContentResponse<grupoDto>>(`${this.api}/groups/${id}/cancel`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }

  CerrarGrupo(id: string): Observable<ContentResponse<grupoDto>> {
    return this.http
      .patch<ContentResponse<grupoDto>>(`${this.api}/groups/${id}/close`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }

  AsignarProfessorGrupo(
    id: string,
    professorId: string
  ): Observable<ContentResponse<grupoDto>> {
    const params = new HttpParams().append('professorId', professorId);
    return this.http
      .patch<ContentResponse<grupoDto>>(
        `${this.api}/groups/${id}/professor/assign`,
        { params }
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  DesasignarProfessorGrupo(
    id: string,
    professorId: string
  ): Observable<ContentResponse<grupoDto>> {
    const params = new HttpParams().append('professorId', professorId);
    return this.http
      .patch<ContentResponse<grupoDto>>(
        `${this.api}/groups/${id}/professor/unassign`,
        { params }
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  SincronizarHorarioGrupo(
    grupoId: string,
    schedule: schedule[]
  ): Observable<ContentResponse<grupoDto>> {
    return this.http
      .patch<ContentResponse<grupoDto>>(
        `${this.api}/groups/${grupoId}/schedules/sync`,
        { schedule }
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
}
