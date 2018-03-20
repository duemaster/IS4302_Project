import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthService {

    admin: any;

    constructor(private http: HttpClient) {
        this.admin = localStorage.getItem('admin');
        console.log(this.admin);
    }


    logout() {
        localStorage.removeItem("admin");
        this.admin = null;
    }
}
