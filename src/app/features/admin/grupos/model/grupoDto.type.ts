import { baseCode, daySchedule, professor } from '@core/shared/types';
import { schedule } from '../../schedules/model/schedule.type';
import { convocatoriaDTO } from '../../convocatorias/model/convocatoriaDTO.type';
import { cursoDto } from '../../cursos/models/cursoDto.type';

export type grupoDto = Omit<baseCode, 'name' | 'description'> & {
  modality: string;
  observations: string;
  professor: professor;
  call: convocatoriaDTO;
  course: cursoDto;
  capacity: number | null;
  availableSeats: number | null;
  status: string;
  schedules: daySchedule[];
};
