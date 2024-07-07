import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { CanActivateFn,Router  } from '@angular/router';
import { inject } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const localStore = inject(LocalStorageService);
  const authService = inject(AuthentificationService);
  const token: any =  localStore.getItem('token').getValue();

  if (token?.access) {

    if (authService.isTokenExpired(token.access.token)) {
      const result = await authService.refreshToken();
      if (!result) {
        router.navigate(['/auth/login']);
        return false;
      }
    }
    const isValid = await authService.validateToken(token.access.token);
    console.log(isValid);
    if (isValid) {
      return true;
    } else {
      localStore.removeItem('token');
      localStore.removeItem('user');
    }
  }
  router.navigate(['/auth/login']);
  return false;

  
};
