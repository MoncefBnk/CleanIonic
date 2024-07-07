import { LoginPage } from 'src/app/pages/login/login.page';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequestError, LoginRequestSuccess } from '../interfaces/login';
import { Auth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,deleteUser,getAuth, User} from '@angular/fire/auth';
import { LocalStorageService } from './local-storage.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private http = inject(HttpClient);
  private route = environment.url_api;
  private userService = inject(UserService);
  private localStorage = inject(LocalStorageService);

  constructor(private auth : Auth) {
  }

  async login(email: string, password: string) : Promise<LoginRequestSuccess | LoginRequestError> {
    try {
      const res = await signInWithEmailAndPassword(this.auth,email,password);
      const  connectedUser = res.user;
      var idTokenResult = await connectedUser.getIdTokenResult(true);
      const user = await this.userService.getUser(connectedUser.uid);
      const expirationTime = idTokenResult.expirationTime; 
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
      await this.userService.createUser(
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
      return {
        code: 401,
        error: true,
        message: this.getErrorMessage(error),
      } as LoginRequestError;
    }
  }

  async logOut() {
    await signOut(this.auth);
  }

  async deleteAccount() {
    const connectedUser = this.auth.currentUser;
    if(connectedUser) {
      await deleteUser(connectedUser).then(() => {
        this.userService.deleteUser(connectedUser.uid);
      });
      
    }
  }

  async validateToken(token: string): Promise<boolean> {
    const user = await this.auth.currentUser;
    
    if (user) {
      const idToken = await user.getIdToken();
      return token === idToken;
    }
    return false;
  }

  isTokenExpired(token: string): boolean {
    console.log(this.localStorage.getItem('token'));
    
    return false;
  }

  async refreshToken() {
    const user = await this.auth.currentUser;
    if(user) {
      const userconnected = await this.userService.getUser(user.uid);
      user.getIdToken(true).then(token => {
        this.localStorage.setItem('token', {
          access: {
            token: token,
            expire: '',
          },
          refresh: {
            token: '',
            expire: '',
          },
        });
      });
      if(userconnected)
        this.localStorage.setItem('user',userconnected);

      return true;
    }
    return false;
    
  }
  
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!token && !!user;
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
