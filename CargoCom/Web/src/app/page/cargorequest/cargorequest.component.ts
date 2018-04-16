import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {BlockChainService} from "../../service/blockchain/block-chain.service";
import {AuthService} from "../../service/auth.service";
import {SettingService} from "../../service/setting/setting.service";
import {HttpClient} from "@angular/common/http";
import * as Rx from "rxjs/Rx";

@Component({
    selector: 'app-flight',
    templateUrl: './cargorequest.component.html',
    styleUrls: ['./cargorequest.component.scss']
})
export class CargoRequestComponent implements AfterViewInit {

    displayedColumns = ['Departure', 'Destination', 'Status', 'DeliveryDate', 'Option'];
    dataSource = new MatTableDataSource([]);

    cargoRequest: any = {};

    cargoInfo: any = {};

    flightList: any;

    isError = false;
    errorMessage: string;
    windowObj: any = window;

    availFlight: any = [];

    public loading;


    constructor(private http: HttpClient,
                public setting: SettingService,
                public authService: AuthService,
                public blockChainService: BlockChainService) {
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    async ngAfterViewInit() {
        //this.loading = true;
        this.dataSource.paginator = this.paginator;
        await this.fetchRequestList();
        await this.fetchFlightList();
        //this.loading = false;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    async update(element) {
        this.cargoRequest = element;

        //Fetch available options
        this.availFlight = await this.getAvailableFlightsForCargoRequest(this.cargoRequest);

        this.cargoInfo = await this.http.get(
            `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${this.cargoRequest.cargo}`,
            {withCredentials: true}
        ).toPromise();

        //Remove namespace
        if (this.cargoInfo.flight)
            this.cargoInfo.flight = this.cargoInfo.flight.replace(`${this.blockChainService.FLIGHT}#`, "");
        this.cargoInfo.company = this.cargoInfo.company.replace(`${this.blockChainService.CARGO_COMPANY}#`, "");
    }

    private async getAvailableFlightsForCargoRequest(cargoRequest: any) {

        //Retrieve Cargo
        let cargo = await this.http.get(
            `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${cargoRequest.cargo}`,
            {withCredentials: true}
        ).toPromise();

        console.log(this.flightList);

        let eligibleFlights = this.flightList
            .filter((flight) => {
                console.log(cargoRequest);
                console.log(flight);
                return this.canFlightFitRequestSchedule(cargoRequest, flight)
            })
            .filter((flight) => {
                return this.canCargoAttachFlight(cargo, flight);
            });

        return eligibleFlights;
    }

    private canFlightFitRequestSchedule(cargoRequest: any, flight: any): boolean {
        let isValid = true;
        //Check destination
        if (flight.origin != cargoRequest.origin || flight.destination != cargoRequest.destination)
            isValid = false;

        //Check Timing
        if (flight.departureTime.getTime() < cargoRequest.earlyDepartureTime.getTime() || flight.departureTime.getTime() > cargoRequest.lateDepartureTime.getTime())
            isValid = false;

        if(flight.status != "SCHEDULED")
            isValid = false;

        return isValid;
    }

    private async canCargoAttachFlight(cargo: any, flight: any): Promise<boolean> {
        //If no aircraft is assigned
        if (!flight.aircraft) {
            return false;
        }

        let aircraft: any = await this.http.get(
            `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Aircraft/${flight.aircraft}`,
            {withCredentials: true}
        ).toPromise();

        let flightCargoCap = aircraft.cargoCapacity;

        if (!flight.cargos)
            flight.cargos = [];

        let currentTotalCargoWeight =
            Rx.Observable.of(flight.cargos)
                .flatMap((cargo) => {
                    return this.http.get(
                        `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${cargo}`,
                        {withCredentials: true}
                    );
                })
                .reduce((currentWeight: number, cargo: any) => {
                    return currentWeight + cargo.weight;
                }, 0);

        console.log(currentTotalCargoWeight);

        return currentTotalCargoWeight + cargo.weight > flightCargoCap;
    }

    async acceptRequest() {
        if (!this.cargoInfo.flight || this.cargoInfo.flight === '') {
            this.isError = true;
            this.errorMessage = 'You must assign a flight to the cargo item';
        } else {
            this.loading = true;
            this.isError = false;
            await this.http.post(
                `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AcceptCargoRequest`,
                {
                    cargoRequest: `${this.blockChainService.CARGO_REQUEST}#${this.cargoRequest.id}`,
                    flight: `${this.blockChainService.FLIGHT}#${this.cargoInfo.flight}`
                },
                {withCredentials: true})
                .toPromise();
            await this.fetchRequestList();
            this.loading = false;
            return this.windowObj.jQuery('.modal-backdrop').click();
        }

    }

    async fetchRequestList() {
        let requestList: any = await this.http.get(
            `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CargoRequest`,
            {withCredentials: true}
        ).toPromise();

        //Remove Namespace
        requestList = requestList.map((request) => {
            //If request is accepted
            if (request.acceptedCompany)
                request.acceptedCompany = request.acceptedCompany.replace(
                    `${this.blockChainService.CARGO_COMPANY}#`,
                    ""
                );

            request.cargo = request.cargo.replace(
                `${this.blockChainService.CARGO}#`,
                ""
            );

            return request;
        });

        //Update Dates to correct Date Format
        requestList = requestList.map((request) => {
            request.earlyDepartureTime = new Date(request.earlyDepartureTime);
            request.lateDepartureTime = new Date(request.lateDepartureTime);

            return request;
        });

        this.loadDataInTable(requestList)
    }

    async fetchFlightList() {
        let flightList: any = await this.http.get(
            `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            {withCredentials: true}
        ).toPromise();

        //Convert Date into proper format
        this.flightList = flightList.map((flight) => {
            flight.departureTime = new Date(flight.departureTime);


            //Remove namespace for aircraft
            flight.aircraft = flight.aircraft.replace(`${this.blockChainService.AIRCRAFT}#`, "");
            return flight;
        });
    }

    loadDataInTable(requestList) {
        this.dataSource = new MatTableDataSource<any>(requestList);
        this.dataSource.paginator = this.paginator;
    }
}
