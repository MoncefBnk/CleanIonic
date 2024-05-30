import { LoginPage } from 'src/app/pages/login/login.page';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequestError, LoginRequestSuccess } from '../interfaces/login';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private http = inject(HttpClient);
  private route = environment.url_api;

  constructor() {}

  login(email: string, password: string) {
    // RETURN SOME FAKE DATA FOR NOW

    const fakeEmail = 'moncef@gmail.com';
    const fakePassword = '12345678';
    if (email !== fakeEmail || password !== fakePassword) {
      return{
        code: 401,
        error: true,
        message: 'Invalid email or password',
      } as LoginRequestError;
    } else {
      return {
        code: 201,
        error: false,
        token: {
          access: {
            token: 'access_token',
            expire: 'expire_date',
          },
          refresh: {
            token: 'access_token',
            expire: 'expire_date',
          },
        },
        user: {
          role: 'user',
          isEmailVerified: true,
          email: email,
          name: 'moncef',
          id: '1234567890',
        },
      } as LoginRequestSuccess;
    }
  }
  // START: IN CASE OF USING HTTP REQUEST//

  // login(email: string, password: string) {
  //   return this.http
  //     .post(`${this.route}/auth/login`, {
  //       email: email,
  //       password: password,
  //     })
  //     // .pipe(catchError(this.errorRequest))

  // }
   // END : IN CASE OF USING HTTP REQUEST//

  register(email: string, password: string , phoneNumber: string , firstName: string , lastName: string) {
    // RETURN SOME FAKE DATA FOR NOW
    const fakeEmail = 'moncef@gmail.com'
    if (email !== fakeEmail) {
      return {
        code: 401,
        error: true,
        message: 'Invalid email',
      } as LoginRequestError;
    } else {
      return {
        code: 201,
        error: false,
        token: {
          access: {
            token: 'access_token',
            expire: 'expire_date',
          },
          refresh: {
            token: 'access_token',
            expire: 'expire_date',
          },
        },
        user: {
          role: 'user',
          isEmailVerified: true,
          email: email,
          name: 'moncef',
          id: '1234567890',
        },
      } as LoginRequestSuccess;
    }
  }

  errorRequest(httpError: HttpErrorResponse): Observable<LoginRequestError> {
    return of({ ...httpError.error, error: true });
  }
}
