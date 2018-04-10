import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {ServiceDetailPage} from "../serviceDetail/serviceDetail";
import {LoginPage} from "../login/login";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {UserProvider} from "../../providers/user/user";
import {CargoProvider} from "../../providers/cargo/cargo";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,private barcodeScanner: BarcodeScanner,
              public userProvider:UserProvider,public cargoProvider:CargoProvider) {


  }

  logout(){
    this.userProvider.logout(this.navCtrl);
  }

  async openScanner(){
    this.barcodeScanner.scan().then(async barcodeData => {
      console.log('Barcode data', barcodeData);

      if(barcodeData.cancelled)
        return;

      let cargo = await this.cargoProvider.getCargo(barcodeData.text);

      if(cargo)
        return this.navCtrl.push(ServiceDetailPage,{cargo:cargo});

      alert("Cargo Not Found.");

    }).catch(err => {
      console.log('Error', err);
    });
  }

}
