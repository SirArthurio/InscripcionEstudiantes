import { user } from '@core/shared/types/user.type';
import { currentUser, UserRole } from '@core/shared/types/currentUser.type';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { ContentResponse } from '@core/shared/types';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { CurrentUserService } from '../service/current-user.service';

export type currentValueStore = currentUser & {
  role: string;
};

const currentInitialValue: currentValueStore = {
  role: '',
  user: null,
  student: null,
  superadmin: null,
};
const keyUser = environment.keyUser;
export const currentStore = signalStore(
  { providedIn: 'root' },

  withState(currentInitialValue),
  withMethods((store, currentService = inject(CurrentUserService)) => ({
    resetCurrent() {
      patchState(store, currentInitialValue);
    },
    setRole(role: string) {
      patchState(store, { role });
    },
    cleanLocalUserData() {
      localStorage.removeItem(store.user()?.role as keyof UserRole);
      localStorage.removeItem(keyUser);
    },
    setUser(user: user) {
      patchState(store, { user });
      this.setRole(user.role);
    },
    setLocalUser() {
      const user = store.user();
      if (user) {
        localStorage.setItem(keyUser, JSON.stringify(user));
      }
    },
    setLocalUserData() {
      const user = store.user();
      if (!user) return;

      const name = user.role;
      const userData = store[name as keyof UserRole]();
      if (userData) {
        const value = userData;
        console.log('user data', userData);

        if (value !== undefined && value !== null) {
          localStorage.setItem(name, JSON.stringify(value));
        }
      }
    },
    setUserData<K extends keyof currentUser>(
      userType: K,
      data: currentUser[K]
    ) {
      patchState(store, {
        [userType]: data,
      } satisfies Partial<currentUser>);
    },

    async currentUser(token: string): Promise<ContentResponse<currentUser>> {
      try {
        const current = firstValueFrom(currentService.CurrentUser(token));
        if (!current) {
          throw current as Error;
        }
        return current;
      } catch (error) {
        throw error;
      }
    },
  })),
  withHooks((store) => ({
    onInit() {
      const currentUser = localStorage.getItem(keyUser);

      if (currentUser) {
        store.setUser(JSON.parse(currentUser));
        const userType = store.user()?.role as keyof UserRole;
        const currentUserData = localStorage.getItem(userType);
        if (currentUserData) {
          store.setUserData(userType, JSON.parse(currentUserData));
        }
      }
    },
  }))
);
