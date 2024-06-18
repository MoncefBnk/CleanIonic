import { Routes } from '@angular/router';
import { tabroutes } from './layouts/tabs/tabs.routes';
import { authGuard } from 'src/app/core/guard/auth.guard';


export const routes: Routes = [
  {
    // Delete
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth/auth.page').then((m) => m.AuthPage),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.page').then((m) => m.RegisterPage),
      },
    ],
  },
  ...tabroutes,
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.page').then( m => m.SearchPage),
    canActivate: [authGuard]
  },
  {
    path: 'player',
    loadComponent: () => import('./pages/player/player.page').then( m => m.PlayerPage),
    canActivate: [authGuard]
  },
  {
    path: 'music-playlist',
    loadComponent: () => import('./pages/musicplaylist/musicplaylist.page').then( m => m.MusicplaylistPage),
    canActivate: [authGuard]
  },
  {
    path: 'setting',
    loadComponent: () => import('./pages/setting/setting.page').then( m => m.SettingPage),
    canActivate: [authGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },

  






];
