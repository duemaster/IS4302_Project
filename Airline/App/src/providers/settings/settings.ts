import { Injectable } from '@angular/core';

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  readonly ENDPOINT: string = "http://172.25.105.138:9000";

  constructor() {
    console.log('Hello SettingsProvider Provider');
  }

}
