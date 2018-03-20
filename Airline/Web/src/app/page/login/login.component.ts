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

    windowObj: any = window;

    constructor(public authService: AuthService, public router: Router, public http: HttpClient,
                public toast: ToastsManager, vcr: ViewContainerRef, private util: Util) {
        this.toast.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
    }


    async login() {
        let query = this.util.paras({
            username: this.username,
            password: this.password
        });

        this.http.post(environment.SERVER + "/login" + query, {},{ responseType: 'text',withCredentials: true })
            .subscribe(() => {
                    this.authService.admin = this.username;
                    this.router.navigate(['/main/home']);
                },
                err => {
                    console.log(err);
                    this.windowObj.toastr.error('Incorrect user name or password.', 'Fail');
                });


    }
}
