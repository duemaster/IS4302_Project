import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {BlockChainService} from "../../service/blockchain/block-chain.service";
import {AuthService} from "../../service/auth.service";
import {SettingService} from "../../service/setting/setting.service";
import {HttpClient} from "@angular/common/http";

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

    public loading = false;


    constructor(private http: HttpClient,
                public setting: SettingService,
                public authService: AuthService,
                public blockChainService: BlockChainService) {
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.fetchRequestList();
        this.fetchFlightList();
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    async update(element) {
        this.cargoRequest = element;



        this.cargoRequest.earlyDepartureTime = new Date(this.cargoRequest.earlyDepartureTime);
        this.cargoRequest.lateDepartureTime = new Date(this.cargoRequest.lateDepartureTime);

        this.flightList = this.flightList.map((flight) => {
            flight.departureTime = new Date(flight.departureTime);

            return flight;
        });

        this.availFlight = this.flightList.filter(
            (flight) => {
                let isValid = true;
                if (flight.origin != this.cargoRequest.origin || flight.destination != this.cargoRequest.destination)
                    isValid = false;
                if (flight.departureTime.getTime() < this.cargoRequest.earlyDepartureTime.getTime() || flight.departureTime.getTime() > this.cargoRequest.lateDepartureTime.getTime())
                    isValid = false;

                return isValid;
            }
        );

        //Remove Namespace
        let cargoId = this.cargoRequest.cargo.replace(`${this.blockChainService.CARGO}#`, "");

        this.cargoInfo = await this.http.get(
            `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${cargoId}`,
            {withCredentials: true}
        ).toPromise();

        this.cargoInfo.flight = this.cargoInfo.flight.replace(`${this.blockChainService.FLIGHT}#`, "");

        //console.log(this.cargoInfo);
        this.cargoInfo.company = this.cargoInfo.company.replace(`${this.blockChainService.CARGO_COMPANY}#`, "");

        console.log(this.cargoRequest);
        console.log(this.availFlight);
    }

    async acceptRequest() {
        if (!this.cargoRequest.flight || this.cargoRequest.flight === '') {
            this.isError = true;
            this.errorMessage = 'You must assign a flight to the cargo item';
        } else {
            this.loading = true;
            this.isError = false;
            await this.http.post(
                `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AcceptCargoRequest`,
                {
                    cargoRequest: `${this.blockChainService.CARGO_REQUEST}#${this.cargoRequest.id}`,
                    flight: `${this.blockChainService.FLIGHT}#${this.cargoRequest.flight}`
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
        this.loadDataInTable(requestList)
    }

    async fetchFlightList() {
        this.flightList = await this.http.get(
            `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            {withCredentials: true}
        ).toPromise();

        console.log(this.flightList);
    }

    loadDataInTable(requestList) {
        this.dataSource = new MatTableDataSource<any>(requestList);
        this.dataSource.paginator = this.paginator;
    }
}
