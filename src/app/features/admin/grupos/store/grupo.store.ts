import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { grupo } from '../model/grupo.type';
import { inject } from '@angular/core';
import { GrupoService } from '../service/grupo.service';
import { firstValueFrom } from 'rxjs';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { grupoDto } from '../model/grupoDto.type';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { schedule } from '../../schedules/model/schedule.type';

export type grupoStoreValue = {
  grupos: grupoDto[];
  grupo: grupoDto | null;
  convocatoriaId: string;
  cursoId: string;
  competenciaId: string;
  schedule: schedule[];
};

const grupoStoreInitialValue: grupoStoreValue = {
  grupos: [],
  grupo: null,
  convocatoriaId: '',
  cursoId: '',
  competenciaId: '',
  schedule: [],
};

export const GrupoStore = signalStore(
  { providedIn: 'root' },
  withState(grupoStoreInitialValue),
  withMethods(
    (
      store,
      grupoService = inject(GrupoService),
      queryClient = inject(QueryClient)
    ) => ({
      //sets
      setGrupo(grupo: grupoDto) {
        console.log('se seteo en el store el grupo:', grupo);
        patchState(store, { grupo });
      },
      setSchedule(schedule: schedule[]) {
        console.log('se seteo en el store el schedule:', schedule);
        patchState(store, { schedule: schedule });
      },
      setGrupos(grupos: grupoDto[]) {
        patchState(store, { grupos });
      },
      setConvocatoriaId(convocatoriaId: string) {
        console.log('se seteo en el store la convoId:', convocatoriaId);
        patchState(store, { convocatoriaId });
      },
      setCursoId(cursoId: string) {
        console.log('se seteo en el store la curso:', cursoId);

        patchState(store, { cursoId: cursoId });
      },
      setCompetenciaId(competenciaId: string) {
        console.log('se seteo en el store la competencia:', competenciaId);

        patchState(store, { competenciaId: competenciaId });
      },
      //resets
      resetCompetenciaId() {
        patchState(store, {
          competenciaId: grupoStoreInitialValue.competenciaId,
        });
      },
      resetSchedule() {
        patchState(store, { schedule: grupoStoreInitialValue.schedule });
      },
      resetConvocatoriaId() {
        patchState(store, {
          convocatoriaId: grupoStoreInitialValue.convocatoriaId,
        });
      },
      resetCursoId() {
        patchState(store, {
          cursoId: grupoStoreInitialValue.cursoId,
        });
      },
      resetGrupos() {
        patchState(store, { grupos: grupoStoreInitialValue.grupos });
      },
      resetGrupo() {
        patchState(store, { grupo: grupoStoreInitialValue.grupo });
      },
      //invalidates
      invalidateQueryCursos() {
        queryClient.invalidateQueries({ queryKey: ['cursos'] });
      },
      invalidateQueryGrupos() {
        queryClient.invalidateQueries({ queryKey: ['grupos'] });
      },
      //peticiones
      getGruposPorConvocatoriaStudent(
        callId: string
      ): Promise<ContentResponse<grupoDto[]>> {
        try {
          const response = firstValueFrom(
            grupoService.GetGrupos(callId)
          );
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      getGrupo(id: string): Promise<ContentResponse<grupoDto>> {
        try {
          const response = firstValueFrom(grupoService.GetGrupo(id));
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      getGrupos(callId: string): Promise<ContentResponse<grupoDto[]>> {
        try {
          const response = firstValueFrom(grupoService.GetGrupos(callId));
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      createGrupo(grupo: grupo): Promise<ContentResponse<grupoDto>> {
        try {
          const response = firstValueFrom(grupoService.CreateGrupo(grupo));
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      abrirGrupo(id: string): Promise<ContentResponse<grupoDto>> {
        try {
          this.invalidateQueryGrupos();
          const response = firstValueFrom(grupoService.AbrirGrupo(id));
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      cerrarGrupo(id: string): Promise<ContentResponse<grupoDto>> {
        try {
          this.invalidateQueryGrupos();
          const response = firstValueFrom(grupoService.CerrarGrupo(id));
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      cancelarGrupo(id: string): Promise<ContentResponse<grupoDto>> {
        try {
          this.invalidateQueryGrupos();
          const response = firstValueFrom(grupoService.CancelarGrupo(id));
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      
      sincronizarSchedule(grupoId: string, schedule: schedule[]) {
        try {
          const response = firstValueFrom(
            grupoService.SincronizarHorarioGrupo(grupoId, schedule)
          );
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
    })
  )
);
