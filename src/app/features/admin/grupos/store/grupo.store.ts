import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { grupo } from '../model/grupo.type';
import { inject } from '@angular/core';
import { GrupoService } from '../service/grupo.service';
import { firstValueFrom } from 'rxjs';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { grupoDto } from '../model/grupoDto.type';
import { QueryClient } from '@tanstack/angular-query-experimental';

export type grupoStoreValue = {
  grupos: grupo[];
  grupo: grupo | null;
};

const grupoStoreInitialValue: grupoStoreValue = {
  grupos: [],
  grupo: null,
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
      setGrupo(grupo: grupo) {
        patchState(store, { grupo });
      },
      setGrupos(grupos: grupo[]) {
        patchState(store, { grupos });
      },
      resetGrupos() {
        patchState(store, { grupos: grupoStoreInitialValue.grupos });
      },
      resetGrupo() {
        patchState(store, { grupo: grupoStoreInitialValue.grupo });
      },
      invalidateQueryCursos() {
        queryClient.invalidateQueries({ queryKey: ['cursos'] });
      },
      invalidateQueryGrupos() {
        queryClient.invalidateQueries({ queryKey: ['grupos'] });
      },
      getGruposPorConvocatoria(
        page: number,
        idConvocatoria: string
      ): Promise<ContentResponse<grupoDto[]>> {
        try {
          const response = firstValueFrom(
            grupoService.GetGruposPorConvocatoria(page, idConvocatoria)
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
    })
  )
);
