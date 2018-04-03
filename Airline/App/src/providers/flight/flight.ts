import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SettingsProvider} from "../settings/settings";
import {UtilityProvider} from "../utility/utility";
import {UserProvider} from "../user/user";

/*
  Generated class for the FlightProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FlightProvider {

  flight:any={};

  constructor(public http: HttpClient,public setting: SettingsProvider,
              public utility: UtilityProvider,public userprovider:UserProvider) {
    console.log('Hello FlightProvider Provider');
  }

  async getFlightList(){
    const loader = await this.utility.showLoading("Please wait...");
    loader.present();

    let flightList:[] = await this.http.get(
      `${this.setting.ENDPOINT}/blockchain/user/${this.userprovider.user.id}/api/org.airline.airChain.Flight`,
      {withCredentials: true}
    ).toPromise();

    loader.dismissAll();

    console.log(flightList);
  }

  processFlight(flightList){
    let flight = flightList
      .filter(item=>{item.status='SCHEDULED'})
      .sort((a,b)=>a.departureTime.getTime()-b.departureTime.getTime())[0];

    if(!flight)
      return;
    flight.departureCode = fligt.origin.slice(0,3).toUpperCase();
    flight.destinationCode = fligt.destination.slice(0,3).toUpperCase();

    this.flight = flight;
  }


}
