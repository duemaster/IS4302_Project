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
import {Util} from "./util/util";
import {SettingService} from "./service/setting/setting.service";
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { CargoComponent } from './page/cargo/cargo.component';
import { CargoRequestComponent } from './page/cargorequest/cargorequest.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule} from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator"
import {MatFormFieldControl, MatInputModule, MatNativeDateModule} from "@angular/material";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {BlockChainService} from "./service/blockchain/block-chain.service";
import {DateTimePickerModule} from "ngx-datetime-picker";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LayoutComponent,
        CargoComponent,
        CargoRequestComponent,
        DashboardComponent
    ],
    imports: [
        FormsModule,
        ROUTING,
        HttpClientModule,
        BrowserModule,
        OrderModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatPaginatorModule,
        DateTimePickerModule,
        BrowserAnimationsModule,
        ToastModule.forRoot(),
        LoadingModule.forRoot({
            animationType: ANIMATION_TYPES.rotatingPlane,
            backdropBackgroundColour: 'rgba(0,0,0,0.1)',
            backdropBorderRadius: '0px',
            primaryColour: '#0aa89e',
        })
    ],
    providers: [AuthService, AuthGuard, ToastModule,Util,SettingService,BlockChainService],
    bootstrap: [AppComponent],
})
export class AppModule {
}
