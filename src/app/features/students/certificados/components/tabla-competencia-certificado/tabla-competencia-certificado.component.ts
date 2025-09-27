import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
  Signal,
  signal,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
interface CompetenciaStudent {
  id: string;
  nombre: string;
  descripcion: string;
  codigo?: string;
  certificadoSubido: boolean;
  nombreArchivo?: string;
  fechaSubida?: Date;
  estado: 'pendiente' | 'subido' | 'aprobado' | 'rechazado';
  comentarios?: string;
}
interface ArchivoSubida {
  competenciaId: string;
  archivo: File;
  progreso: number;
}

@Component({
  selector: 'app-tabla-competencia-certificado',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    ProgressBarModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './tabla-competencia-certificado.component.html',
  styleUrl: './tabla-competencia-certificado.component.scss',
})
export class TablaCompetenciaCertificadoComponent {
  //inputs
  competencias = input<CompetenciaStudent[]>([
    {
      id: '1',
      nombre: 'Desarrollo Web Frontend',
      descripcion:
        'Competencia en tecnologías frontend modernas como React, Angular y Vue',
      codigo: 'DWF-001',
      certificadoSubido: true,
      nombreArchivo: 'certificado-frontend.pdf',
      fechaSubida: new Date('2024-01-15'),
      estado: 'aprobado',
    },
    {
      id: '2',
      nombre: 'Bases de Datos Relacionales',
      descripcion: 'Diseño y administración de bases de datos SQL',
      codigo: 'BDR-002',
      certificadoSubido: false,
      estado: 'pendiente',
    },
    {
      id: '3',
      nombre: 'Metodologías Ágiles',
      descripcion: 'Scrum, Kanban y otras metodologías de desarrollo ágil',
      codigo: 'MAG-003',
      certificadoSubido: true,
      nombreArchivo: 'scrum-master-cert.pdf',
      fechaSubida: new Date('2024-02-20'),
      estado: 'subido',
    },
    {
      id: '4',
      nombre: 'Seguridad Informática',
      descripcion: 'Principios de ciberseguridad y protección de datos',
      codigo: 'SEG-004',
      certificadoSubido: true,
      nombreArchivo: 'cybersecurity-cert.pdf',
      fechaSubida: new Date('2024-01-10'),
      estado: 'rechazado',
      comentarios:
        'El certificado no es válido, debe ser de una institución acreditada',
    },
  ]);
  permitirMultiplesArchivos = input(false);
  sizeMax = input(5000000); // 5MB
  tiposPermitidos = input('.pdf,.jpg,.jpeg,.png');
  //ouputs

  onArchivoSubido = output<{
    competencia: CompetenciaStudent;
    archivo: File;
  }>();
  onArchivoEliminado = output<CompetenciaStudent>();
  onDescargarCertificado = output<CompetenciaStudent>();

  // Signals
  archivosSubiendo = signal<ArchivoSubida[]>([]);
  competenciaExpandida = signal<string | null>(null);
  visible = signal<boolean>(false);
  progress = signal<number>(0);
  interval = signal<any>(null);

  //injects
  messageService = inject(MessageService);
  cdr = inject(ChangeDetectorRef);

  onUpload(event: any, competencia: CompetenciaStudent) {
    const archivo = event.files[0];
    if (!archivo) return;

    // Validar tamaño
    if (archivo.size > this.sizeMax()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `El archivo es muy grande. Máximo ${
          this.sizeMax() / 1000000
        }MB`,
      });
      return;
    }
    this.mostrarProgreso();

    // Simular subida con progreso
    const archivoSubida: ArchivoSubida = {
      competenciaId: competencia.id!,
      archivo,
      progreso: 0,
    };

    ///////////////////
    this.archivosSubiendo.update((archivos) => [...archivos, archivoSubida]);

    if (this.interval()) {
      clearInterval(this.interval()!);
      this.interval.set(null);
    }

    const id = setInterval(() => {
      this.archivosSubiendo.update((archivos) =>
        archivos.map((a) =>
          a.competenciaId === competencia.id
            ? { ...a, progreso: Math.min(a.progreso + 10, 100) }
            : a
        )
      );

      this.progress.update((p) => Math.min(p + 10, 100));

      ///progreso

      const archivoActual = this.archivosSubiendo().find(
        (a) => a.competenciaId === competencia.id
      );
      if (archivoActual && archivoActual.progreso >= 100) {
        clearInterval(this.interval()!);
        this.cerrarProgreso();

        // Actualizar competencia
        const index = this.competencias().findIndex(
          (c) => c.id === competencia.id
        );
        if (index > -1) {
          this.competencias()[index] = {
            ...competencia,
            certificadoSubido: true,
            nombreArchivo: archivo.name,
            fechaSubida: new Date(),
            estado: 'subido',
          };
        }

        // Remover de archivos subiendo
        this.archivosSubiendo.update((archivos) =>
          archivos.filter((a) => a.competenciaId !== competencia.id)
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Certificado subido correctamente',
        });

        this.onArchivoSubido.emit({ competencia, archivo });
        this.cerrarProgreso();
      }
    }, 200);
  }

  eliminarCertificado(competencia: CompetenciaStudent) {
    const index = this.competencias().findIndex((c) => c.id === competencia.id);
    if (index > -1) {
      this.competencias()[index] = {
        ...competencia,
        certificadoSubido: false,
        nombreArchivo: undefined,
        fechaSubida: undefined,
        estado: 'pendiente',
        comentarios: undefined,
      };
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Eliminado',
      detail: 'Certificado eliminado correctamente',
    });

    this.onArchivoEliminado.emit(competencia);
  }

  descargarCertificado(competencia: CompetenciaStudent) {
    this.messageService.add({
      severity: 'info',
      summary: 'Descarga',
      detail: `Descargando ${competencia.nombre}`,
    });

    this.onDescargarCertificado.emit(competencia);
  }

  obtenerSeverityEstado(
    estado: string
  ): 'primary' | 'success' | 'secondary' | 'warn' | 'contrast' {
    console.log('estado', estado);
    switch (estado.toLocaleLowerCase()) {
      case 'aprobado':
        return 'primary';
      case 'subido':
        return 'secondary';
      case 'rechazado':
        return 'warn';
      default:
        return 'contrast';
    }
  }

  obtenerIconoEstado(estado: string): string {
    switch (estado) {
      case 'aprobado':
        return 'pi pi-check-circle';
      case 'subido':
        return 'pi pi-upload';
      case 'rechazado':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-clock';
    }
  }

  obtenerTextoEstado(estado: string): string {
    switch (estado) {
      case 'aprobado':
        return 'Aprobado';
      case 'subido':
        return 'En revisión';
      case 'rechazado':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  }

  obtenerProgresoSubida(competenciaId: string): number {
    const archivo = this.archivosSubiendo().find(
      (a) => a.competenciaId === competenciaId
    );
    return archivo?.progreso || 0;
  }

  estaSubiendo(competenciaId: string): boolean {
    return this.archivosSubiendo().some(
      (a) => a.competenciaId === competenciaId
    );
  }

  toggleExpansion(competenciaId: string) {
    const actual = this.competenciaExpandida();
    this.competenciaExpandida.set(
      actual === competenciaId ? null : competenciaId
    );
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  ////////////
  mostrarProgreso() {
    if (!this.visible()) {
      this.messageService.add({
        key: 'confirm',
        sticky: false,
        severity: 'custom',
        summary: 'Subiendo el archivo',
        styleClass: 'backdrop-blur-lg rounded-2xl',
      });
      this.visible.set(true);
      this.progress.set(0);
    }
  }

  cerrarProgreso() {
    this.visible.set(false);
  }
}
