import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ContentResponse, ContentResponsePaginated } from '@core/shared/types';
import { firstValueFrom } from 'rxjs';
import { inject } from '@angular/core';
import { competencias } from '../model/competencias.type';
import { CompetenciasService } from '../service/competencias.service';
import { competenciaDto } from '../model/competenciaDto.type';
import { QueryClient } from '@tanstack/angular-query-experimental';

export type competenciaValueStore = {
  competencia: competencias | null;
  competencias: competencias[];
};

const competenciaInitialValue: competenciaValueStore = {
  competencia: null,
  competencias: [],
};

export const competenciaStore = signalStore(
  { providedIn: 'root' },
  withState(competenciaInitialValue),
  withMethods(
    (
      store,
      competenciaService = inject(CompetenciasService),
      queryClient = inject(QueryClient)
    ) => ({
      setCompetencia(competencia: competencias) {
        patchState(store, { competencia });
      },
      setCompetencias(competencias: competencias[]) {
        patchState(store, { competencias });
      },
      resetCompetencia() {
        patchState(store, { competencia: competenciaInitialValue.competencia });
      },
      resetCompetencias() {
        patchState(store, {
          competencias: competenciaInitialValue.competencias,
        });
      },
      invalidarQuery() {
        queryClient.invalidateQueries({ queryKey: ['competencias'] });
      },
      activarCompetencia(id: string) {
        try {
          this.invalidarQuery();
          const response = firstValueFrom(
            competenciaService.ActivarCompetencia(id)
          );
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      archivarCompetencia(id: string) {
        try {
          this.invalidarQuery();
          const response = firstValueFrom(
            competenciaService.ArchivarCompetencia(id)
          );
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      getCompetencias(
        page: number,
        status: string
      ): Promise<ContentResponse<competenciaDto[]>> {
        try {
          const response = firstValueFrom(
            competenciaService.GetCompetencias(page, status)
          );
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },

      getCompetencia(id: string): Promise<ContentResponse<competenciaDto>> {
        try {
          const response = firstValueFrom(
            competenciaService.GetCompetencia(id)
          );
          if (!response) throw Error;
          return response;
        } catch (error) {
          throw error;
        }
      },
      createCompetencia(
        competencia: competencias
      ): Promise<ContentResponse<competencias>> {
        try {
          const response = firstValueFrom(
            competenciaService.CreateCompetencias(competencia)
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
