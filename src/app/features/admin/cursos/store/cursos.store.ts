import { inject } from '@angular/core';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { curso } from '../models/curso.type';
import { CursoService } from '../service/curso.service';

export type cursosStoreValue = {
  cursos: curso[];
  curso: curso | null;
};

const initialCursosStoreValue: cursosStoreValue = {
  cursos: [],
  curso: null,
};

export const cursosStore = signalStore(
  { providedIn: 'root' },
  withState(initialCursosStoreValue),
  withMethods((store, cursoService = inject(CursoService)) => ({
    setCursos(cursos: curso[]) {
      patchState(store, { cursos });
    },
    setCurso(curso: curso) {
      patchState(store, { curso });
    },
    resetCursos() {
      patchState(store, { cursos: initialCursosStoreValue.cursos });
    },
    resetCurso() {
      patchState(store, { curso: initialCursosStoreValue.curso });
    },

    getCursos(): Promise<ContentResponsePaginated<curso[]>> {
      try {
        const response = firstValueFrom(cursoService.GetCursos());
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
    createCurso(
      curso: curso,
      competencia: string
    ): Promise<ContentResponse<curso>> {
      try {
        const response = firstValueFrom(
          cursoService.CreateCursos(curso, competencia)
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
  }))
);
