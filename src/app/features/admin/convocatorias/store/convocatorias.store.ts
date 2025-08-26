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
import { convocatoria } from '../model/convocatoria.type';
import { convocatoriaDTO } from '../model/convocatoriaDTO.type';
import { ConvocatoriasService } from '../service/convocatorias.service';
import { editConvocatoria } from '../pages/ver-convocatorias/components/card-generic/model/edit.convocatoria.type';

export type convocatoriasStoreValue = {
  convocatorias: convocatoriaDTO[];
  convocatoria: convocatoriaDTO | null;
};
const convocatoriasInitialValueStore: convocatoriasStoreValue = {
  convocatoria: null,
  convocatorias: [],
};

export const convocatoriasStore = signalStore(
  { providedIn: 'root' },
  withState(convocatoriasInitialValueStore),
  withMethods((store, convocatoriaService = inject(ConvocatoriasService)) => ({
    setConvocatoria(convocatoria: convocatoriaDTO) {
      patchState(store, { convocatoria });
    },
    setConvocatorias(convocatorias: convocatoriaDTO[]) {
      patchState(store, { convocatorias });
    },

    resetConvocatoria() {
      patchState(store, { convocatoria: null });
    },

    async getConvocatorias(
      page: number,
      status: string
    ): Promise<ContentResponsePaginated<convocatoriaDTO[]>> {
      try {
        const response = await firstValueFrom(
          convocatoriaService.GetConvocatorias(page, status)
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
    async publishConvocatoria(
      id: string
    ): Promise<ContentResponse<convocatoriaDTO>> {
      try {
        const response = await firstValueFrom(
          convocatoriaService.PublishConvocatoria(id)
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
    async cancelConvocatoria(
      id: string
    ): Promise<ContentResponse<convocatoriaDTO>> {
      try {
        const response = await firstValueFrom(
          convocatoriaService.CancelConvocatoria(id)
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },

    async closeConvocatoria(
      id: string,
      name: string
    ): Promise<ContentResponse<convocatoriaDTO>> {
      try {
        const response = await firstValueFrom(
          convocatoriaService.CloseConvocatoria(id, name)
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },

    async updateEnrollmentDates(
      id: string,
      enrollmentStartDate: string,
      enrollmentEndDate: string
    ): Promise<ContentResponse<convocatoriaDTO>> {
      try {
        const response = await firstValueFrom(
          convocatoriaService.UpdateEnrollmentDatesConvocatoria(
            id,
            enrollmentStartDate,
            enrollmentEndDate
          )
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },

    async updateInformationConvocatoria(
      id: string,
      edit: editConvocatoria
    ): Promise<ContentResponse<convocatoriaDTO>> {
      try {
        const response = await firstValueFrom(
          convocatoriaService.UpdateInformationConvocatoria(id, edit)
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
