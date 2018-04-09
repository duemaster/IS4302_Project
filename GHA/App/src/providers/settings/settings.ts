import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {
  readonly ENDPOINT: string = "http://localhost:9001";
  constructor(public http: HttpClient) {
    console.log('Hello SettingsProvider Provider');
  }

}
