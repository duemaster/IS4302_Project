import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {CargoProvider} from "../../providers/cargo/cargo";

@Component({
  selector: 'page-serviceDetail',
  templateUrl: 'serviceDetail.html'
})
export class ServiceDetailPage {

  cargo:any;
  constructor(public navCtrl: NavController,public navPara:NavParams,
              public cargoProvider:CargoProvider,private alertCtrl: AlertController) {

    this.cargo = navPara.get("cargo");
  }

  async callTransaction() {
    let res = await this.cargoProvider.sendTransaction(this.cargo.id);
    console.log(res);
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: 'Cargo has been collected from warehouse',
      buttons: ['Ok']
    });
    alert.present();
    this.navCtrl.pop();
  }

}
