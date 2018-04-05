import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {BlockChainService} from "../../service/blockchain/block-chain.service";
import {AuthService} from "../../service/auth.service";
import {SettingService} from "../../service/setting/setting.service";
import {HttpClient} from "@angular/common/http";
import {toPromise} from "rxjs/operator/toPromise";

@Component({
    selector: 'app-flight',
    templateUrl: './flight.component.html',
    styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {

    constructor(private http: HttpClient,
                private service: SettingService,
                public authService: AuthService,
                public blockChainService: BlockChainService) {
    }

    ngOnInit() {
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

    newService = {
        id: '',
        description: '',
        status: '',
        type: '',
        company: 'GHA1'
    };

    serviceList = [{
        id: '',
        description: '',
        status: '',
        type: '',
    }];

    cargoList = [{
        id: '',
        description: '',
        status: '',
        company: '',
        weight: 0,
    }];

    isCreate = false;
    staffList: any;


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.fetchFlightList();
        //this.fetchStaffList();
    }

    async viewService(flight) {
        this.loading = true;
        this.flight = flight;
        this.serviceList = [];
        for (let item of flight.services) {
            item = item.replace(`${this.blockChainService.SERVICE}#`,'');
            console.log(item);
            let serviceDetail: any = await this.http.get(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Service/${item}`,
                {withCredentials: true}
            ).toPromise();
            serviceDetail.company = serviceDetail.company.replace(`${this.blockChainService.GHA_COMPANY}#`,'');
            this.serviceList.push(serviceDetail);
        }
        this.loading = false;
    }

    async viewCargo(flight) {
        this.loading = true;
        this.cargoList = [];
        for (let item of flight.cargos) {
            let cargoDetail: any = await this.http.get(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${item}`,
                {withCredentials: true}
            ).toPromise();
            //Remove Cabin Crew NameSpace
            if (cargoDetail.company) {
                cargoDetail.company = cargoDetail.company.replace(this.blockChainService.CARGO_COMPANY, "");
            }
            this.cargoList.push(cargoDetail);
        }
        this.loading = false;

    }

    viewFlight(element) {
        this.flight = element;
    }

    async addService() {
        this.loading = true;
        this.newService.id = `${new Date().getTime()}`;
        this.newService.status = 'PENDING';

        let response1 = await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Service`,
            this.newService,
            {withCredentials: true})
            .toPromise();

        let response2 = await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.IssueFlightServiceRequest`,
            {
                flight: `${this.blockChainService.FLIGHT}#${this.flight.id}`,
                service: `${this.blockChainService.SERVICE}#${this.newService.id}`
            },
            {withCredentials: true})
            .toPromise();
        this.loading = false;
        this.serviceList.push(this.newService);

        this.newService = {
            id: '',
            description: '',
            status: '',
            type: '',
            company: 'GHA1'
        };

    }

    async deleteService(service) {

        service.status = 'CANCELLED';
        await this.http.put(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Service/${service.id}`,
            {withCredentials: true},
            service
        ).toPromise();
        this.serviceList.splice(this.serviceList.indexOf(service), 1);
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

    loadDataInTable(flightList) {
        this.dataSource = new MatTableDataSource<any>(flightList);
        this.dataSource.paginator = this.paginator;
    }


}
