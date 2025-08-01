import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContentResponse } from '@core/shared/types';
import { environment } from '@environments/environment.development';
import { Observable, catchError, throwError } from 'rxjs';
import { currentUser } from '@core/shared/types/currentUser.type';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  api = environment.back;
  prefix = 'auth';
  http = inject(HttpClient);

  CurrentUser(token: string): Observable<ContentResponse<currentUser>> {
    return this.http
      .get<ContentResponse<currentUser>>(
        `${this.api}/${this.prefix}/current-user`
      )
      .pipe(catchError((error) => throwError(() => error)));
  }
}
