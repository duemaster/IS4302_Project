import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AlertController, AlertOptions, Loading, LoadingController, LoadingOptions} from "ionic-angular";
import {Subject} from "rxjs/Subject";

@Injectable()
export class UtilityProvider {

  constructor(private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
  }

  async showLoading(content: string, loadingOptions: LoadingOptions = {}): Promise<Loading> {
    return this.loadingCtrl.create(Object.assign(loadingOptions, {content}))
  }

  showAlert(title,des){
    let alert = this.alertCtrl.create({title: title, subTitle: des, buttons: ['Dismiss']});
    alert.present();
  }

}
