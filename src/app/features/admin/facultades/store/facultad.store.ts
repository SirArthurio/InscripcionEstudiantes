import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { facultie } from '../model/facultie.type';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { firstValueFrom } from 'rxjs';
import { FacultadesService } from '../service/facultades.service';
import { inject } from '@angular/core';

export type facultieValue = {
  facultad: facultie | null;
  facultades: facultie[];
};

const facultieInitialValue: facultieValue = {
  facultad: null,
  facultades: [],
};

export const facultadStore = signalStore(
  { providedIn: 'root' },
  withState(facultieInitialValue),
  withMethods((store, facultadService = inject(FacultadesService)) => ({
    setFacultad(facultad: facultie) {
      patchState(store, { facultad });
    },
    setFacultades(facultades: facultie[]) {
      patchState(store, { facultades });
    },
    resetFacultad() {
      patchState(store, { facultad: facultieInitialValue.facultad });
    },
    resetFacultades() {
      patchState(store, { facultades: facultieInitialValue.facultades });
    },
    getFacultad(id: string): Promise<ContentResponse<facultie>> {
      try {
        const response = firstValueFrom(facultadService.GetFacultad(id));
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
    getFacultades(
      page: number,
      status: string
    ): Promise<ContentResponsePaginated<facultie[]>> {
      try {
        const response = firstValueFrom(
          facultadService.GetFacultades(page, status)
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
    createFacultad(facultad: facultie): Promise<ContentResponse<facultie>> {
      try {
        const response = firstValueFrom(
          facultadService.CreateFacultades(facultad)
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
  }))
);
