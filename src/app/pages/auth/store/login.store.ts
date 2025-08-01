import { ContentResponse } from '@core/shared/types';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { login } from '../login/model/Login.type';
import { inject } from '@angular/core';
import { firstValueFrom, throwError } from 'rxjs';
import { loginResponse } from '../login/model/LoginResponse.type';
import { currentUser } from '@core/shared/types/currentUser.type';
import { LoginService } from '../service/login.service';
export type loginStoreValue = {
  id: string;
  token: string;
};

const loginStoreInitialValue: loginStoreValue = {
  token: '',
  id: '',
};
const key = 'token';
export const loginStore = signalStore(
  { providedIn: 'root' },
  withState(loginStoreInitialValue),
  withMethods((store, loginService = inject(LoginService)) => ({
    setToken(token: string) {
      patchState(store, { token });
    },
    setTokenLocal() {
      localStorage.setItem(key, store.token());
    },

    async login(data: login): Promise<ContentResponse<loginResponse>> {
      try {
        const loginData = await firstValueFrom(loginService.Login(data));
        if (!loginData) {
          throw loginData as Error;
        }
        return loginData;
      } catch (error) {
        throw error;
      }
    },
    async forgotPassword(email: string): Promise<ContentResponse> {
      try {
        const response = await firstValueFrom(
          loginService.ForgotPassword(email)
        );

        return response;
      } catch (error) {
        throw error;
      }
    },
    async resetPassword(
      email: string,
      token: string
    ): Promise<ContentResponse> {
      try {
        const response = await firstValueFrom(
          loginService.ResetPassword(email, token)
        );

        return response;
      } catch (error) {
        throw error;
      }
    },
    resetLoginStore() {
      patchState(store, loginStoreInitialValue);
    },
  })),
  withHooks((store) => ({
    onInit() {
      const token = JSON.stringify(localStorage.getItem(key));
      if (token) {
        store.setToken(token);
      }
    },
  }))
);
