import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { authGuard } from './services/guards/auth.guard';
import { signInGuard } from './services/guards/signin.guard';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'auth/login',
    component: Login,
    canActivate: [signInGuard],
  },
];
