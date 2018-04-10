import {SettingsProvider} from "../settings/settings";
import {UtilityProvider} from "../utility/utility";
import {UserProvider} from "../user/user";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AlertController} from "ionic-angular";

/*
  Generated class for the FlightProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FlightProvider {

  flight: any = {};

  constructor(public http: HttpClient, public setting: SettingsProvider,
              public utility: UtilityProvider, public userProvider: UserProvider,
              private alertCtrl: AlertController) {
    console.log('Hello FlightProvider Provider');
  }

  async getFlightList() {
    const loader = await this.utility.showLoading("Loading flight info...");
    loader.present();

    let flightList: any = await this.http.get(
      `${this.setting.ENDPOINT}/blockchain/user/${this.userProvider.user.id}/api/org.airline.airChain.Flight`,
      {withCredentials: true}
    ).toPromise();

    loader.dismissAll();
    console.log(flightList);

    this.processFlight(flightList);
  }

  processFlight(flightList) {
    let flight: any = flightList
      .filter(item => item.status == 'SCHEDULED')
      .sort((a, b) => a.departureTime.getTime() - b.departureTime.getTime())[0];
    if (!flight) {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'You have no scheduling flight',
        buttons: ['Ok']
      });
      return alert.present();
    }


    console.log(flight);
    flight.originCode = flight.origin.slice(0, 3).toUpperCase();
    flight.destinationCode = flight.destination.slice(0, 3).toUpperCase();

    this.flight = flight;
    this.getServiceInfo();
  }


  async getServiceInfo() {
    const loader = await this.utility.showLoading("Loading service info...");
    loader.present();


    let serviceList: any = await this.http.get(
      `${this.setting.ENDPOINT}/blockchain/user/${this.userProvider.user.id}/api/org.airline.airChain.Service`,
      {withCredentials: true}
    ).toPromise();

    serviceList = serviceList.filter(item => item.status != 'PENDING' && item.status != 'REJECTED' && item.flight.indexOf(this.flight.id));
    serviceList.forEach(item => item.companyName = item.company.split("#")[1]);
    this.flight.serviceList = serviceList;

    loader.dismissAll();
  }


  async sendTransaction(isApproved: boolean, service) {

    service = "org.airline.airChain.Service#" + service;
    const loader = await this.utility.showLoading("Sending transaction request...");
    loader.present();

    let data = {
      service: service,
      isApproved: isApproved,
    };
    let res: any = await this.http.post(
      `${this.setting.ENDPOINT}/blockchain/user/${this.userProvider.user.id}/api/org.airline.airChain.ProcessFlightServiceDelivery`, data,
      {withCredentials: true}
    ).toPromise();

    console.log(res);
    loader.dismissAll();

    return res;
  }

  async takeoff() {

    let flightId = "org.airline.airChain.Flight#" + this.flight.id;
    const loader = await this.utility.showLoading("Sending transaction request...");
    loader.present();

    let data = {
      flight: flightId,
    };
    let res: any = await this.http.post(
      `${this.setting.ENDPOINT}/blockchain/user/${this.userProvider.user.id}/api/org.airline.airChain.UpdateFlightTakeOff`, data,
      {withCredentials: true}
    ).toPromise();

    console.log(res);
    loader.dismissAll();

    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: 'Flight has been updated to DEPARTED',
      buttons: ['Ok']
    });
    alert.present();

    this.flight.status = 'DEPARTED';
  }
}
