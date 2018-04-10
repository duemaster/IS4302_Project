import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {BlockChainService} from "../../service/blockchain/block-chain.service";
import {AuthService} from "../../service/auth.service";
import {SettingService} from "../../service/setting/setting.service";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-flight',
    templateUrl: './flight.component.html',
    styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements AfterViewInit {

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    async ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        await this.fetchFlightList();
        //this.fetchStaffList();
    }

    constructor(private http: HttpClient,
                private service: SettingService,
                public authService: AuthService,
                public blockChainService: BlockChainService) {
    }

    public loading = false;
    displayedColumns = ['FlightNo', 'Date', 'Departure', 'Landing', 'Status', 'Option'];
    dataSource = new MatTableDataSource([]);

    flight = {
        departureTime: '',
        id: '',
        origin: '',
        flightNumber: '',
        destination: '',
        paxCount: 0,
        company: '',
        status: '',
        cabinCrew: [{}],
        cargos: [{}],
        services: [{}],
        aircraft: {},
    };

    isError = false;
    errorMessage: string;
    windowObj:any = window;

    newService: any;

    serviceList: any;

    cargoList = [{
        id: '',
        description: '',
        status: '',
        company: '',
        weight: 0,
    }];

    isCreate = false;
    staffList: any;

    async viewService(flight) {
        this.isError = false;

        this.newService = {};

        this.loading = true;
        this.flight = flight;
        this.serviceList = await this.fetchServiceListForFlight(this.flight.id);
        this.loading = false;
    }

    async viewCargo(flight) {
        this.loading = true;

        this.cargoList = await this.fetchCargoListForFlight(flight.id);
        this.loading = false;

    }

    viewFlight(element) {
        this.flight = element;
    }

    async addService() {
        if(!this.newService.description || !this.newService.type){
            this.isError = true;
            this.errorMessage = 'Please fill in all required fields';
        }else {
            this.isError = false;
            this.loading = true;
            this.newService.id = new Date().getTime().toString();

            //add Flight Information
            this.newService.flight = `${this.blockChainService.FLIGHT}#${this.flight.id}`;

            //Submit Transaction
            await this.http.post(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.IssueFlightServiceRequest`,
                this.newService,
                {withCredentials: true}
            ).toPromise();

            this.serviceList = await this.fetchServiceListForFlight(this.flight.id);

            this.loading = false;
            this.newService = {};
        }

    }

    async deleteService(service) {

        let serviceToDelete = Object.assign({}, service);
        delete serviceToDelete["id"];
        serviceToDelete.status = 'CANCELLED';
        this.loading = true;

        console.log(serviceToDelete);

        let response = await this.http.put(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Service/${service.id}`,
            serviceToDelete,
            {withCredentials: true}
        ).toPromise();
        console.log(response);

        this.serviceList = await this.fetchServiceListForFlight(this.flight.id);
        this.loading = false;

    }

    async fetchFlightList() {
        let flightList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            {withCredentials: true}
        ).toPromise();

        flightList = flightList.map((flight) => {
            //Remove Cabin Crew NameSpace
            if (flight.cabinCrews) {
                flight.cabinCrew = flight.cabinCrew.replace(this.blockChainService.AIRLINE_EMPLOYEE, "");

            }

            //Remove Aircraft NameSpace
            if (flight.aircraft) {
                flight.aircraft = flight.aircraft.replace(this.blockChainService.AIRCRAFT, "");
            }

            return flight;
        });

        console.log(flightList);

        this.loadDataInTable(flightList);
    }

    private loadDataInTable(flightList) {
        this.dataSource = new MatTableDataSource<any>(flightList);
        this.dataSource.paginator = this.paginator;
    }

    private async fetchServiceListForFlight(flightId: string) {
        let entireServiceList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Service`,
            {withCredentials: true}
        ).toPromise();

        //Filter out those that do not belong to flight
        let serviceList = entireServiceList.filter((service) => {
            return service.flight === `${this.blockChainService.FLIGHT}#${flightId}`;
        });

        return serviceList;
    }

    private async fetchCargoListForFlight(flightId: string) {
        let entireCargoList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo`,
            {withCredentials: true}
        ).toPromise();

        console.log(entireCargoList);

        //Filter out those that do not belong to flight
        let cargoList = entireCargoList.filter((cargo) => {
            return cargo.flight === `${this.blockChainService.FLIGHT}#${flightId}`;
        });

        return cargoList;
    }


}
