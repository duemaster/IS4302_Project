import {SettingsProvider} from "../settings/settings";
import {UtilityProvider} from "../utility/utility";
import {UserProvider} from "../user/user";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

/*
  Generated class for the CargoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CargoProvider {

  cargo: any;

  constructor(public http: HttpClient, public setting: SettingsProvider,
              public utility: UtilityProvider, public userprovider: UserProvider) {
    console.log('Hello CargoProvider Provider');
  }

  async getCargo(id) {
    const loader = await this.utility.showLoading("Loading cargo info...");
    loader.present();

    let cargoList: any = await this.http.get(
      `${this.setting.ENDPOINT}/blockchain/user/${this.userprovider.user.id}/api/org.airline.airChain.Cargo`,
      {withCredentials: true}
    ).toPromise();

    loader.dismissAll();
    console.log(cargoList);
    let cargo = cargoList.find(item => item.id == id);
    if (cargo)
      cargo.companyName = cargo.company.split("#")[1];

    return cargo;
  }



  async sendTransaction(cargoId){

    cargoId = "org.airline.airChain.Cargo#"+cargoId;
    const loader = await this.utility.showLoading("Sending transaction request...");
    loader.present();

    let data ={
      cargo: cargoId
    };
    let res:any = await this.http.post(
      `${this.setting.ENDPOINT}/blockchain/user/${this.userprovider.user.id}/api/org.airline.airChain.ConfirmCargoToWarehouse`, data,
      {withCredentials: true}
    ).toPromise();

    console.log(res);
    loader.dismissAll();

    return res;
  }

}
