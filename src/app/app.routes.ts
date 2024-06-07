import { Routes } from '@angular/router';
import { tabroutes } from './layouts/tabs/tabs.routes';


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
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.page').then( m => m.SearchPage)
  },
  {
    path: 'player',
    loadComponent: () => import('./pages/player/player.page').then( m => m.PlayerPage)
  },
  {
    path: 'music-playlist',
    loadComponent: () => import('./pages/musicplaylist/musicplaylist.page').then( m => m.MusicplaylistPage)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },





];
