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
  {
    path: 'search',
    loadComponent: () =>
      import('./layouts/search/search.page').then((m) => m.SearchPage),
    children: [
      {
        path: 'default',
        loadComponent: () =>
          import('./pages/defaultsearch/defaultsearch.page').then( m => m.DefaultsearchPage),
      },
      {
        path: 'artist',
        loadComponent: () => import('./pages/searchartist/searchartist.page').then( m => m.SearchartistPage)
      },
      {
        path: 'album',
        loadComponent: () => import('./pages/searchalbum/searchalbum.page').then( m => m.SearchalbumPage)
      },
      {
        path: 'song',
        loadComponent: () => import('./pages/searchsong/searchsong.page').then( m => m.SearchsongPage)
      },
      {
        path: '',
        redirectTo: '/search/default',
        pathMatch: 'full',
      },
    ],
    canActivate: [authGuard]
  },
  ...tabroutes,
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage),
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
