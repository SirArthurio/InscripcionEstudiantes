import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { firstValueFrom } from 'rxjs';
import { convocatoria } from '../crear-convocatoria/model/convocatoria.type';
import { convocatoriaDTO } from '../crear-convocatoria/model/convocatoriaDTO.type';
import { ConvocatoriasService } from '../service/convocatorias.service';

export type convocatoriasStoreValue = {
  convocatorias: convocatoriaDTO[];
  convocatoria: convocatoria | null;
};
const convocatoriasInitialValueStore: convocatoriasStoreValue = {
  convocatoria: null,
  convocatorias: [],
};

export const convocatoriasStore = signalStore(
  { providedIn: 'root' },
  withState(convocatoriasInitialValueStore),
  withMethods((store, convocatoriaService = inject(ConvocatoriasService)) => ({
    setConvocatoria(convocatoria: convocatoria) {
      patchState(store, { convocatoria });
    },
    setConvocatorias(convocatorias: convocatoriaDTO[]) {
      patchState(store, { convocatorias });
    },

    resetConvocatoria() {
      patchState(store, { convocatoria: null });
    },

    async getConvocatorias(): Promise<
      ContentResponsePaginated<convocatoriaDTO[]>
    > {
      try {
        const response = await firstValueFrom(
          convocatoriaService.GetConvocatorias()
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },

    async createConvocatorias(
      convocatoria: convocatoria
    ): Promise<ContentResponse<convocatoria>> {
      try {
        const response = await firstValueFrom(
          convocatoriaService.CreateConvocatoria(convocatoria)
        );
        if (!reportError) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
  }))
);
