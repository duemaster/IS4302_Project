import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SettingService} from "./setting/setting.service";

@Injectable()
export class AuthService {

    admin: any;

    constructor(private http: HttpClient,
                public setting: SettingService) {
        this.admin = JSON.parse(localStorage.getItem('admin'));
        console.log(this.admin);
    }

    async login(userName: string, password: string) {
        try {
            this.admin = await this.http.post(
                `${this.setting.ENDPOINT}/user/login`,
                {name: userName, password: password},
                {withCredentials: true}
            ).toPromise();

            //Save in Cookie
            localStorage.setItem("admin", JSON.stringify(this.admin));
            return true;
        } catch (e) {
            return false;
        }
    }

    async logout() {
        await this.http.post(
            `${this.setting.ENDPOINT}/user/logout`,
            this.admin,
            {withCredentials: true}
        ).toPromise();

        localStorage.removeItem("admin");
        this.admin = null;
    }
}
