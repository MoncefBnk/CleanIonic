import { LoginPage } from 'src/app/pages/login/login.page';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequestError, LoginRequestSuccess } from '../interfaces/login';
import { Auth,signInWithEmailAndPassword,createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private http = inject(HttpClient);
  private route = environment.url_api;
  private serviceFirestore = inject(FirestoreService);

  constructor(private auth : Auth) {}

  async login(email: string, password: string) : Promise<LoginRequestSuccess | LoginRequestError> {
    try {
      const res = await signInWithEmailAndPassword(this.auth,email,password);
      const  connectedUser = res.user;
      var idTokenResult = await connectedUser.getIdTokenResult(true);
      const user = await this.serviceFirestore.getUser(connectedUser.uid);

      const expirationTime = idTokenResult.expirationTime; 
      console.log(idTokenResult);
      return {
        code: 201,
        error: false,
        token: {
          access: {
            token: idTokenResult.token,
            expire: expirationTime,
          },
          refresh: {
            token: '',
            expire: '',
          },
        },
        user: user,
      } as LoginRequestSuccess; 
    }catch (err) {
      console.log(this.getErrorMessage(err));
      return {
        code: 401,
        error: true,
        message: this.getErrorMessage(err),
      } as LoginRequestError;
    }
  }

  async loginWithEmail(email: string, password: string) : Promise<LoginRequestSuccess | LoginRequestError> {
    try {
      const res = await signInWithEmailAndPassword(this.auth,email,password);
      const  connectedUser = res.user;
      var idTokenResult = await connectedUser.getIdTokenResult(true);
      const user = await this.serviceFirestore.getUser(connectedUser.uid);

      const expirationTime = idTokenResult.expirationTime; 
      console.log(idTokenResult);
      return {
        code: 201,
        error: false,
        token: {
          access: {
            token: idTokenResult.token,
            expire: expirationTime.toString(),
          },
          refresh: {
            token: '',
            expire: '',
          },
        },
        user: user,
      } as LoginRequestSuccess; 
    }catch (err) {
      console.log(this.getErrorMessage(err));
      return {
        code: 401,
        error: true,
        message: this.getErrorMessage(err),
      } as LoginRequestError;
    }
  }

  async register(email: string, password: string , phoneNumber: string , firstName: string , lastName: string,dateBirth:Date) : Promise<LoginRequestSuccess | LoginRequestError>  {
    try {
      const result = await createUserWithEmailAndPassword(this.auth,email, password);
      const  user = result.user;
      var idTokenResult = await user.getIdTokenResult(true);
      await this.serviceFirestore.createUser(
        user.uid,
        email,
        password,
        phoneNumber,
        firstName,
        lastName,
        dateBirth,
        false,
        0,
        false,
        'user');

        const expirationTime = idTokenResult.expirationTime; 
      return {
        code: 201,
        error: false,
        token: {
          access: {
            token: idTokenResult.token,
            expire: expirationTime.toString(),
          },
          refresh: {
            token: '',
            expire: '',
          },
        },
        user: {
          role: 'user',
          isEmailVerified: false,
          id: user.uid,
          email: email,
          firstname: firstName,
          lastname: lastName,
          dateBirth: dateBirth,
          followers: 0,
          isArtist: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      } as LoginRequestSuccess; 
    } catch (error) {
      console.log(error);
      return {
        code: 401,
        error: true,
        message: this.getErrorMessage(error),
      } as LoginRequestError;
    }
  }


  errorRequest(httpError: HttpErrorResponse): Observable<LoginRequestError> {
    return of({ ...httpError.error, error: true });
  }

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'The email address is already in use by another account.';
      case 'auth/invalid-email':
        return 'The email address is badly formatted.';
      case 'auth/user-disabled':
        return 'The user corresponding to the given email has been disabled.';
      case 'auth/user-not-found':
        return 'There is no user corresponding to the given email.';
      case 'auth/wrong-password':
        return 'The password is invalid or the user does not have a password.';
      case 'auth/invalid-credential':
        return 'Invalid credentials';
      default:
        return 'An unknown error occurred. Please try again.';
    }
  }
}
