import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AboutPage} from "../about/about";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  scan(){
    this.navCtrl.push(AboutPage);
  }

  logout(){
    this.navCtrl.setRoot(LoginPage);
  }

}
