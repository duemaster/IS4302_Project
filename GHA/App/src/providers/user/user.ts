import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SettingsProvider} from "../settings/settings";
import {UtilityProvider} from "../utility/utility";

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  user: any = {
    id: 15061,
    name: "staff1",
    password: "$2a$10$UabZp6ngvtBLcSwFvGG7qO5PVTV9G/Dyat1uWZx4Wn/Rv.fXzxnRi",
    portNumber: 15061,
    processId: "139",
    role: "STAFF",
    timeStamp: 1523329488202,
    userCardName: "15061@air-chain"
  };

  constructor(public http: HttpClient, public setting: SettingsProvider, public utility: UtilityProvider) {
    console.log('Hello UserProvider Provider');
  }


  async logout(navCtrl) {
    const loader = await this.utility.showLoading("Please wait...");
    loader.present();

    await this.http.post(`${this.setting.ENDPOINT}/user/logout`, this.user, {
      withCredentials: true,
      responseType: "text"
    }).toPromise();
    loader.dismissAll();
    this.user = null;
    navCtrl.setRoot("LoginPage");
  }

  async login(userName, password, navCtrl) {
    if (!userName || !password)
      return this.utility.showAlert("Error", "Please fill in user name and password");

    const loader = await this.utility.showLoading("Please wait...");
    loader.present();

    this.http.post(
      `${this.setting.ENDPOINT}/user/login`,
      {name: userName, password: password},
      {withCredentials: true}
    ).subscribe(res => {
      loader.dismissAll();
      this.user = res;
      console.log(res);
      navCtrl.setRoot("HomePage");
    }, err => {
      loader.dismissAll();
      this.utility.showAlert("Error", err.error);
    });
  }

}
