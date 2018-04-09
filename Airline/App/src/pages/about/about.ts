import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FlightProvider} from "../../providers/flight/flight";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  service: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public flightService: FlightProvider) {
    this.service = navParams.get("service");
    console.log(this.service);
  }

  async callTransaction(isApproved) {
    let res = await this.flightService.sendTransaction(isApproved, this.service.id);
    if (res.isApproved)
      this.service.status = "DONE";
    this.navCtrl.pop();
  }


}
