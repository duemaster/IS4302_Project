import {Injectable} from '@angular/core';

@Injectable()
export class BlockChainService {

    readonly namespace = "resource:org.airline.airChain";

    readonly AIRLINE_COMPANY: string = `${this.namespace}.AirlineCompany`;
    readonly CARGO_COMPANY: string = `${this.namespace}.CargoCompany`;
    readonly GHA_COMPANY: string = `${this.namespace}.GHACompany`;

    readonly AIRLINE_EMPLOYEE: string = `${this.namespace}.AirlineEmployee`;
    readonly CARGO_EMPLOYEE: string = `${this.namespace}.CargoEmployee`;
    readonly GHA_EMPLOYEE: string = `${this.namespace}.GHAEmployee`;

    readonly AIRCRAFT: string = `${this.namespace}.Aircraft`;
    readonly FLIGHT: string = `${this.namespace}.Flight`;
    readonly SERVICE: string = `${this.namespace}.Service`;

    constructor() {
    }

}
