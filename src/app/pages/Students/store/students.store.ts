import { inject } from '@angular/core';
import { ContentResponsePaginated } from '@core/shared/types';
import { student } from '@core/shared/types/users/estudiante.type';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { StudentsService } from '../service/students.service';

export type studentStoreValue = {
  student: student | null;
  students: student[];
};

const studentStoreInitialValue: studentStoreValue = {
  student: null,
  students: [],
};

export const StudentStore = signalStore(
  { providedIn: 'root' },
  withState(studentStoreInitialValue),
  withMethods((store, studentService = inject(StudentsService)) => ({
    setStudent(student: student) {
      patchState(store, { student });
    },
    setStudents(students: student[]) {
      patchState(store, { students });
    },
    resetStuden() {
      patchState(store, { student: null });
    },
    resetStudents() {
      patchState(store, { students: [] });
    },
    async getStudents(
      page: number,
      state: string
    ): Promise<ContentResponsePaginated<student[]>> {
      try {
        const response = await firstValueFrom(
          studentService.GetStudents(page, state)
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
  }))
);
