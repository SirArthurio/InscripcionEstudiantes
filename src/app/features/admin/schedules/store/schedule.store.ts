import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { schedule } from '../model/schedule.type';

export type scheduleStoreValue = {
  schedule: schedule[];
};

const scheduleStoreInitialValue: scheduleStoreValue = {
  schedule: [],
};

export const scheduleStore = signalStore(
  { providedIn: 'root' },
  withState(scheduleStoreInitialValue),
  withMethods((store) => ({
    setSchedule(schedule: schedule[]) {
      patchState(store, { schedule });
    },
    resetSchedule() {
      patchState(store, { schedule: scheduleStoreInitialValue.schedule });
    },
  }))
);
