import { inject } from '@angular/core';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { curso } from '../models/curso.type';
import { CursoService } from '../service/curso.service';
import { cursoDto } from '../models/cursoDto.type';
import { QueryClient } from '@tanstack/angular-query-experimental';

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
  withMethods(
    (
      store,
      cursoService = inject(CursoService),
      queryClient = inject(QueryClient)
    ) => ({
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
      invalidarQuery() {
        queryClient.invalidateQueries({ queryKey: ['cursos'] });
      },

      activarCurso(id: string) {
        try {
          this.invalidarQuery();
          const response = firstValueFrom(cursoService.ActivarCurso(id));
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      archivarCurso(id: string) {
        try {
          this.invalidarQuery();
          const response = firstValueFrom(cursoService.ArchivarCurso(id));
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },

      getCurso(id: string): Promise<ContentResponse<cursoDto>> {
        try {
          const response = firstValueFrom(cursoService.GetCurso(id));
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },

      getCursos(
        page: number,
        status: string
      ): Promise<ContentResponsePaginated<curso[]>> {
        try {
          const response = firstValueFrom(cursoService.GetCursos(page, status));
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      getCursosCompetencia(
        page: number,
        status: string,
        idCompetencia: string
      ): Promise<ContentResponsePaginated<curso[]>> {
        try {
          const response = firstValueFrom(
            cursoService.GetCursosCompetencias(idCompetencia, page, status)
          );
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      createCurso(curso: curso): Promise<ContentResponse<curso>> {
        try {
          this.invalidarQuery();

          const response = firstValueFrom(cursoService.CreateCursos(curso));
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
    })
  )
);
