import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { CanActivateFn,Router  } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn =  (route, state) => {
  const router = inject(Router);
  const LocalStore = inject(LocalStorageService);
  console.log('test');
  const token: any =  LocalStore.getItem('token').getValue();
  return token?.access  ? true : false;
};
