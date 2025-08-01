import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContentResponse } from '@core/shared/types';
import { environment } from '@environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { login } from '../login/model/Login.type';
import { loginResponse } from '../login/model/LoginResponse.type';
import { RegistroUsuario } from '../register/model/Register.type';
interface password {
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  api = environment.back;
  prefix = 'auth';
  http = inject(HttpClient);

  Login(data: login): Observable<ContentResponse<loginResponse>> {
    return this.http
      .post<ContentResponse<loginResponse>>(
        `${this.api}/${this.prefix}/login`,
        data
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  Register(
    data: RegistroUsuario
  ): Observable<ContentResponse<RegistroUsuario>> {
    return this.http
      .post<ContentResponse<RegistroUsuario>>(
        `${this.api}/${this.prefix}/register`,
        data
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
  ForgotPassword(email: string): Observable<ContentResponse> {
    const headers = new HttpHeaders().set('user-email', email);
    return this.http.post<ContentResponse>(
      `${this.api}/${this.prefix}/forgot-password`,
      email
    );
  }
  ResetPassword(password: string, token?: string): Observable<ContentResponse> {
    let params = new HttpParams();
    if (token) {
      params = params.set('reset_token', token);
    }

    const body: password = { password };
    console.log(body);
    return this.http.patch<ContentResponse>(
      `${this.api}/${this.prefix}/reset-password`,
      body,
      { params }
    );
  }
}
