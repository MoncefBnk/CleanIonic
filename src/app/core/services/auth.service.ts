import { Injectable, inject } from '@angular/core';
import { EAuthPage } from '../models/refData';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { IToken, IUser } from '../interfaces/user';
import { Auth,authState} from '@angular/fire/auth';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private localStore = inject(LocalStorageService); 
  private authentification = inject(AuthentificationService);
  constructor(private auth : Auth) {}

  getPageAuth() {
    return of(EAuthPage.Login);
  }

  private getTokenExpiration() {
    const tokenSubject: BehaviorSubject<IToken>= this.localStore.getItem<IToken>('token');
    const token = tokenSubject.getValue();
    const tokenExpiration = token ? token.access.expire : null;
    return tokenExpiration ? parseInt(tokenExpiration.toString(), 10) : null;
  }

  private async refreshToken() {
    const userSubject: BehaviorSubject<IUser>= this.localStore.getItem<IUser>('user');
    const storeUser = userSubject.getValue();

    const user = await firstValueFrom(authState(this.auth));
    if (user && storeUser && (user.uid == storeUser.id)) {
        const idTokenResult = await user.getIdTokenResult(true); // Force refresh
      
        const expirationTime = new Date(idTokenResult.expirationTime).getTime();
        const token = {
          access: {
            token: idTokenResult.token,
            expire: expirationTime.toString(),
          },
          refresh: {
            token: '',
            expire: '',
          },
        };
        this.localStore.setItem('token', token);
      } else {
        console.log('AUTHSTATE USER EMPTY', user);
      }
  }

 
}
