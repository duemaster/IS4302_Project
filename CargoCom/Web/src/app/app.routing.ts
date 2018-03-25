import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {LoginComponent} from './page/login/login.component';
import {LayoutComponent} from './page/layout/layout.component';
import {CargoComponent} from "./page/cargo/cargo.component";
import {FlightComponent} from "./page/flight/flight.component";
import {CargoRequestComponent} from "./page/cargorequest/cargorequest.component";
import {DashboardComponent} from "./page/dashboard/dashboard.component";

const APP_ROUTES: Routes = [
    {
        path: 'main',
        component: LayoutComponent,
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
                path: 'flight',
                component: FlightComponent
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
