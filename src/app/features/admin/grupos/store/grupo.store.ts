import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { grupo } from '../model/grupo.type';
import { inject } from '@angular/core';
import { GrupoService } from '../service/grupo.service';
import { firstValueFrom } from 'rxjs';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { grupoDto } from '../model/grupoDto.type';

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
  withMethods((store, grupoService = inject(GrupoService)) => ({
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
    getGrupo(id: string): Promise<ContentResponse<grupo>> {
      try {
        const response = firstValueFrom(grupoService.GetGrupo(id));
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
    createGrupo(grupo: grupo): Promise<ContentResponse<grupo>> {
      try {
        const response = firstValueFrom(grupoService.CreateGrupo(grupo));
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
  }))
);
