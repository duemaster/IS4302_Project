import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ROUTING} from './app.routing';
import {FormsModule} from "@angular/forms";
import {AppComponent} from './app.component';
import {LoginComponent} from './page/login/login.component';
import {AuthService} from './service/auth.service';
import {AuthGuard} from './service/auth.guard';
import {OrderModule} from "ngx-order-pipe";
import {LayoutComponent} from './page/layout/layout.component';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DataTableModule} from 'angular-4-data-table';
import {Util} from "./util/util";
import {SettingService} from "./service/setting/setting.service";
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LayoutComponent
    ],
    imports: [
        FormsModule,
        ROUTING,
        HttpClientModule,
        BrowserModule,
        OrderModule,
        BrowserAnimationsModule,
        ToastModule.forRoot(),
        DataTableModule,
        LoadingModule.forRoot({
            animationType: ANIMATION_TYPES.rotatingPlane,
            backdropBackgroundColour: 'rgba(0,0,0,0.1)',
            backdropBorderRadius: '0px',
            primaryColour: '#0aa89e',
        })
    ],
    providers: [AuthService, AuthGuard, ToastModule,Util,SettingService],
    bootstrap: [AppComponent],
})
export class AppModule {
}
