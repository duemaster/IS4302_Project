import { Injectable } from '@angular/core';

@Injectable()
export class SettingService {

    public readonly ENDPOINT = 'http://172.25.99.189:9003';
    public loading = false;
  constructor() { }

}
