import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { IToken } from '../interfaces/user';

export const authGuard: CanActivateFn =  (route, state) => {
  const LocalStore = inject(LocalStorageService);
  const token =  LocalStore.getItem('token').getValue()
  console.log(token);
  return token != new Array() ? true : false;
};
