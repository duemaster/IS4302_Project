import {Injectable} from '@angular/core';

@Injectable()
export class SettingService {

    public readonly participantType: string = "CargoEmployee";

    public readonly ENDPOINT = 'http://172.25.102.196:9003';
    public loading = false;

    constructor() {
    }

}
