import {
  ContentResponse,
  ContentResponsePaginated,
  professor,
} from '@core/shared/types';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { ProfessorService } from '../service/professor.service';
import { inject } from '@angular/core';

export type professorValueStore = {
  professor: professor | null;
  professors: professor[];
};

const professorInitialValueStore: professorValueStore = {
  professor: null,
  professors: [],
};
export const professorStore = signalStore(
  { providedIn: 'root' },
  withState(professorInitialValueStore),
  withMethods((store, professorService = inject(ProfessorService)) => ({
    setProfessor(professor: professor) {
      patchState(store, { professor });
    },
    setProfessors(professors: professor[]) {
      patchState(store, { professors });
    },
    resetProfessor() {
      patchState(store, { professor: professorInitialValueStore.professor });
    },
    resetProfessors() {
      patchState(store, { professors: professorInitialValueStore.professors });
    },
    getProfessor(
      page: number,
      status: string
    ): Promise<ContentResponsePaginated<professor[]>> {
      try {
        const response = firstValueFrom(
          professorService.GetProfessors(page, status)
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
    createProfessor(professor: professor): Promise<ContentResponse<professor>> {
      try {
        const response = firstValueFrom(
          professorService.CreateProfessors(professor)
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
  }))
);
