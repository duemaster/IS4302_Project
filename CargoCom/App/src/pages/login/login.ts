import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {UserProvider} from "../../providers/user/user";
import {UtilityProvider} from "../../providers/utility/utility";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
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
