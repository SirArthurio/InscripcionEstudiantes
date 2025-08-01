import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContentResponse } from '@core/shared/types';
import { student } from '@core/shared/types/users/estudiante.type';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterStudentService {
  api = environment.back;
  prefix = 'students';
  url = `${this.api}/${this.prefix}/`;
  http = inject(HttpClient);

  RegisterStudent(student: student): Observable<ContentResponse<null>> {
    return this.http
      .post<ContentResponse<null>>(`${this.url}create`, student)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
