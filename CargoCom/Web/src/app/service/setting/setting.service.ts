import { Injectable } from '@angular/core';

@Injectable()
export class SettingService {

    public readonly ENDPOINT = 'http://172.25.104.111:9003';
    public loading = false;
  constructor() { }

}
