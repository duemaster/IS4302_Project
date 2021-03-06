import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {LoginComponent} from './page/login/login.component';
import {LayoutComponent} from './page/layout/layout.component';
import {CargoComponent} from "./page/cargo/cargo.component";
import {CargoRequestComponent} from "./page/cargorequest/cargorequest.component";
import {DashboardComponent} from "./page/dashboard/dashboard.component";
import {AuthGuard} from "./service/auth.guard";

const APP_ROUTES: Routes = [
    {
        path: 'main',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children:[
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'cargo',
                component: CargoComponent
            },
            {
                path: 'cargorequest',
                component: CargoRequestComponent
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        redirectTo: '/main/dashboard',
        pathMatch:'full'
    },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
    },

];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
