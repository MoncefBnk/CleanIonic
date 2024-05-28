import { Routes } from '@angular/router';
import { EAuthPage } from './core/models/refData';
import { AuthService } from './core/services/auth.service';


export const routes: Routes = [

  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth/auth.page').then( m => m.AuthPage),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
        resolve: {
          // component: { AuthService.getPageAuth()},
        }
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage),
        resolve: {
          component: EAuthPage.Register
        }
      },
    ]

  },

  {
    path: 'forgot-password',
    redirectTo: 'auth',
  },
];
