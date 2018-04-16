import {Injectable} from '@angular/core';

@Injectable()
export class SettingService {

    public readonly participantType: string = "CargoEmployee";

    public readonly ENDPOINT = '';
    public loading = false;

    constructor() {
    }

}
