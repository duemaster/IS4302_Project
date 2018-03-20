import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class Util {


    readonly KEY = "";

    readonly SUCCESS = "SUCCESS";
    readonly FAIL = "FAIL";

    constructor() {
    }


    paras(obj: {}) {
        return '?' + Object.keys(obj)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
            .join('&');
    }


}

