import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {UtilityProvider} from "../../providers/utility/utility";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  userName:string;
  password:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public userProvider:UserProvider,public utility:UtilityProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
    this.userProvider.login(this.userName,this.password,this.navCtrl);
  }

  contact(){
    this.utility.showAlert("Contact Admin","Please contact your office admin")
  }

}
