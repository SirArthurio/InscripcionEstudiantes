import { firstValueFrom } from 'rxjs';
import { enrollment } from '../model/enrollment-type';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { EnrollmentService } from '../service/enrollment.service';
import { ContentResponse } from '@core/shared/types';

type enrollmentValue = {
  enrollment: enrollment | null;
  enrollments: enrollment[];
};

export const enrollmentInitialValue: enrollmentValue = {
  enrollment: null,
  enrollments: [],
};

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  withState(enrollmentInitialValue),
  withMethods((store, enrollmentService = inject(EnrollmentService)) => ({
    setEnrollment(enrollment: enrollment) {
      patchState(store, { enrollment });
    },
    setEnrollments(enrollments: enrollment[]) {
      patchState(store, { enrollments });
    },
    resetStore() {
      patchState(store, enrollmentInitialValue);
    },
    matricular(enrollment: enrollment): Promise<ContentResponse<enrollment>> {
      try {
        console.log('llega al store: ', enrollment);
        const response = firstValueFrom(
          enrollmentService.Matricular(enrollment)
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
  }))
);
