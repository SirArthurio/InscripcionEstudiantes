import { inject } from '@angular/core';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { programs } from '@core/shared/types/programas.type';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ProgramasService } from '../servicios/programas.service';
import { firstValueFrom } from 'rxjs';

export type programasStoreValue = {
  programas: programs[];
  programa: programs | null;
};

const initialProgramasStoreValue: programasStoreValue = {
  programas: [],
  programa: null,
};

export const programasStore = signalStore(
  { providedIn: 'root' },
  withState(initialProgramasStoreValue),
  withMethods((store, programaService = inject(ProgramasService)) => ({
    setProgramas(programas: programs[]) {
      patchState(store, { programas });
    },
    setPrograma(programa: programs) {
      patchState(store, { programa });
    },
    resetProgramas() {
      patchState(store, { programas: initialProgramasStoreValue.programas });
    },
    resetPrograma() {
      patchState(store, { programa: initialProgramasStoreValue.programa });
    },
    getProgramas(): Promise<ContentResponsePaginated<programs[]>> {
      try {
        const response = firstValueFrom(programaService.GetProgramas());
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
    createProgram(
      programa: programs,
      facultad: string
    ): Promise<ContentResponse<programs>> {
      try {
        const response = firstValueFrom(
          programaService.CreateProgram(programa, facultad)
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
  }))
);
