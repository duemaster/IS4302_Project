import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LoginPage} from "../login/login";
import {AboutPage} from "../about/about";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(public navCtrl: NavController) {


  }

  logout(){
    this.navCtrl.setRoot(LoginPage);
  }

  viewDetail(){
    this.navCtrl.setRoot(AboutPage);
  }

}
