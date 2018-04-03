import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {ToastsManager} from "ng2-toastr";
import {environment} from "../../../environments/environment";
import {Util} from "../../util/util";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    username = "";
    password = "";

    public loading = false;
    windowObj: any = window;

    constructor(public authService: AuthService,
                public router: Router,
                public http: HttpClient,
                public toast: ToastsManager,
                vcr: ViewContainerRef,
                private util: Util) {
        this.toast.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
    }


    async login() {

        this.loading = true;
        let loginSuccess = await this.authService.login(this.username, this.password);
        this.loading = false;
        if (loginSuccess) {
            await this.router.navigate(['']);
        } else {
            this.windowObj.toastr.error('Incorrect user name or password.', 'Fail');
        }
    }
}
