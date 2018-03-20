import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../service/auth.service";



@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    text:string;
    name: string;
    showMenu:boolean=true;
    constructor(public router: Router, public authService: AuthService, public http: HttpClient) { }

    ngOnInit() {

    }

    toggleMenu(){
        this.showMenu = !this.showMenu;
    }

    search(){
        if(this.text)
            this.router.navigate(["/main/search"],{ queryParams: { text: this.text } });
        this.text = "";
    }

    login(){
        this.router.navigate(["/login"]);
    }

    logout(){
        this.authService.logout();
        this.router.navigate(["/login"]);
    }

}
