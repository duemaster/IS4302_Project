import {Injectable} from '@angular/core';

@Injectable()
export class SettingService {

    public readonly participantType: string = "CargoEmployee";

    public readonly ENDPOINT = 'http://localhost:9004';
    public loading = false;

    constructor() {
    }

}
