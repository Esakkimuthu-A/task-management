import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guard/auth-guard';
import { loginGuard } from './shared/guard/login-guard';

export const routes: Routes = [
    { path: '', redirectTo: "login", pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./core/components/login/login').then((e) => e.Login),
        canActivate: [loginGuard],
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./core/components/dashboard/dashboard').then((e) => e.Dashboard),
        canActivate: [AuthGuard]
    },
];
