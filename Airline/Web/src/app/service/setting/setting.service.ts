import {Injectable} from '@angular/core';

@Injectable()
export class SettingService {

    public readonly ENDPOINT = 'http://localhost:4000';
    public loading = false;

    constructor() {
    }

}
