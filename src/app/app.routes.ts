import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guard/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: "login", pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./core/components/login/login').then((e) => e.Login)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./core/components/dashboard/dashboard').then((e) => e.Dashboard),
        canActivate: [AuthGuard]
    },
];
