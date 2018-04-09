import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {LoginComponent} from './page/login/login.component';
import {LayoutComponent} from './page/layout/layout.component';
import {AircraftComponent} from "./page/aircraft/aircraft.component";
import {FlightComponent} from "./page/flight/flight.component";
import {DashboardComponent} from "./page/dashboard/dashboard.component";
import {AuthGuard} from "./service/auth.guard";

const APP_ROUTES: Routes = [
    {
        path: 'main',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'aircraft',
                component: AircraftComponent
            },
            {
                path: 'flight',
                component: FlightComponent
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
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
    },

];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
