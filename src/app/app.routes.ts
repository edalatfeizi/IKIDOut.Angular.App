import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { authGuard } from './services/guards/auth.guard';
import { signInGuard } from './services/guards/signin.guard';
import { ConnectionError } from './components/common/errorpages/connection-error/connection-error';
import { Confirmcode } from './components/auth/confirmcode/confirmcode';
import { confirmGuard } from './services/guards/confirm.guard';
import { NewProcess } from './components/processes/new-process/new-process';
import { ProcessList } from './components/processes/process-list/process-list';

export const routes: Routes = [
  { path: '', component: Home, canActivate: [authGuard] },
  {
    path: 'auth/login',
    component: Login,
    canActivate: [signInGuard],
  },
  {
    path: 'error/connection',
    component: ConnectionError,
  },
  {
    path: 'auth/confirmcode',
    component: Confirmcode,
    canActivate: [confirmGuard],
  },
  {
    path: 'processes',
    component: ProcessList,
    canActivate: [authGuard],
  },
  {
    path: 'processes/new',
    component: NewProcess,
    canActivate: [authGuard],
  },
];
