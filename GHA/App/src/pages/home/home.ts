import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ServiceDetailPage} from "../serviceDetail/serviceDetail";
import {LoginPage} from "../login/login";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {UserProvider} from "../../providers/user/user";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,private barcodeScanner: BarcodeScanner,
              public userProvider:UserProvider) {

  }

  scan(){
    this.navCtrl.push(ServiceDetailPage);
  }

  logout(){
    this.userProvider.logout(this.navCtrl);
  }

  openScanner(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
    }).catch(err => {
      console.log('Error', err);
    });
  }

}
