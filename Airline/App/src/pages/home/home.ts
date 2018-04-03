import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {FlightProvider} from "../../providers/flight/flight";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public userProvider:UserProvider,public flightProvider:FlightProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.flightProvider.getFlightList();
  }

  logout(){
    this.userProvider.logout(this.navCtrl);
  }
}
