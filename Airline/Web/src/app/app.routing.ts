import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {LoginComponent} from './page/login/login.component';
import {LayoutComponent} from './page/layout/layout.component';

const APP_ROUTES: Routes = [
    {
        path: '',
        component: LayoutComponent,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
    },

];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
