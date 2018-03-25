import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {


  email: string;
  password: string;

  errorMessage: string;
  @ViewChild('input') myInput;


  constructor(public navCtrl: NavController) {

  }

}
