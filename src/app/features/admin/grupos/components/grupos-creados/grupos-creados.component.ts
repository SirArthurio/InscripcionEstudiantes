import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { GrupoStore } from '../../store/grupo.store';
import { grupoDto } from '../../model/grupoDto.type';

// Tipo para la estructura agrupada
interface CompetenciaConCursosYGrupos {
  competenciaId: string;
  competenciaNombre: string;
  cursos: {
    code: string;
    cursoId: string;
    cursoNombre: string;
    grupos: grupoDto[];
  }[];
}

@Component({
  selector: 'grupos-creados',
  imports: [CommonModule],
  templateUrl: './grupos-creados.component.html',
  styleUrl: './grupos-creados.component.scss',
})
export class GruposCreadosComponent {
  grupoStore = inject(GrupoStore);
  grupoSeleccionado = signal<grupoDto | null>(null);
  convocatoriaId = signal<string>('');

  grupos = injectQuery(() => ({
    queryKey: ['grupo', this.convocatoriaId()],
    queryFn: async () => {
      try {
        const response = await this.grupoStore.getGrupos(this.convocatoriaId());
        if (!response) throw Error;
        console.log('llego a creados: ', response);
        return response;
      } catch (error) {
        throw error;
      }
    },
  }));

  seleccionarGrupo(grupo: grupoDto) {
    console.log('se selecciono un grupo');
    this.grupoStore.setGrupo(grupo);
    this.grupoSeleccionado.set(grupo);
  }

  obtenerConvocatroias = effect(() => {
    const convocatoriaId = this.grupoStore.convocatoriaId();
    if (convocatoriaId.length > 0) {
      this.convocatoriaId.set(convocatoriaId);
    }
  });

  // Computed para agrupar jerárquicamente
  gruposAgrupados = computed<CompetenciaConCursosYGrupos[]>(() => {
    const gruposData = this.grupos.data();

    if (
      !gruposData ||
      !Array.isArray(gruposData.data) ||
      gruposData.data.length === 0
    ) {
      return [];
    }

    const grupos = gruposData.data;
    const competenciasMap = new Map<string, CompetenciaConCursosYGrupos>();

    grupos.forEach((grupo) => {
      const competenciaId = grupo.course.competency?.id;
      const competenciaNombre =
        grupo.course.competency?.name || 'Sin competencia';
      const cursoId = grupo.course.id;
      const cursoNombre = grupo.course.name;

      if (!competenciaId) return;

      // Obtener o crear la competencia
      if (!competenciasMap.has(competenciaId)) {
        competenciasMap.set(competenciaId, {
          competenciaId,
          competenciaNombre,
          cursos: [],
        });
      }

      const competencia = competenciasMap.get(competenciaId)!;

      // Buscar o crear el curso dentro de la competencia
      let curso = competencia.cursos.find((c) => c.cursoId === cursoId);
      if (!curso && cursoId) {
        curso = {
          code: grupo.course.code!,
          cursoId,
          cursoNombre,
          grupos: [],
        };
        competencia.cursos.push(curso);
      }

      // Agregar el grupo al curso
      if (curso) {
        curso.grupos.push(grupo);
      }
    });

    return Array.from(competenciasMap.values());
  });
}
