import { Injectable } from '@angular/core';

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  readonly ENDPOINT: string = "http://172.25.98.22:9000";

  constructor() {
    console.log('Hello SettingsProvider Provider');
  }

}
