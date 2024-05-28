import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const tabroutes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../../pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../../pages/tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../../pages/tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../../pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
