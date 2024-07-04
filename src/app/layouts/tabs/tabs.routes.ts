import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from 'src/app/core/guard/auth.guard';

export const tabroutes: Routes = [
  {
    path: 'home',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../../pages/home/home.page').then((m) => m.HomePage),
        canActivate: [authGuard]
      },
      /*{
        path: 'tab2',
        loadComponent: () =>
          import('../../pages/tab2/tab2.page').then((m) => m.Tab2Page),
        canActivate: [authGuard]
      },*/
      {
        path: 'playlist',
        loadComponent: () =>
          import('../../pages/playlist/playlist.page').then((m) => m.PlaylistPage),
        canActivate: [authGuard]
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../../pages/profile/profile.page').then((m) => m.ProfilePage),
        canActivate: [authGuard]
      },
      {
        path: '',
        redirectTo: '/home/home',
        pathMatch: 'full',
      },
    ],
    canActivate: [authGuard],
  },
];
