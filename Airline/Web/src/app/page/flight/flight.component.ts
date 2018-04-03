import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {HttpClient} from "@angular/common/http";
import {SettingService} from "../../service/setting/setting.service";
import {AuthService} from "../../service/auth.service";
import {BlockChainService} from "../../service/blockchain/block-chain.service";

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


    displayedColumns = ['FlightNo', 'Date', 'Departure', 'Landing', 'Status', 'Option'];
    dataSource = new MatTableDataSource([]);
    dateTimeExample;

    flight = {
        departureTime: '',
        id: '',
        flightNumber:'',
        origin: '',
        destination: '',
        paxCount: 0,
        company: 'Airline1',
        status: 'SCHEDULED',
        cabinCrew: {},
        cargo: [{}],
        service: [{}],
        aircraft: {},
        collectCompany: {},
        deliverCompany: {}
    };

    cargo: any;

    isCreate = false;

    crewList: any;
    aircraftList: any;
    agentList: any;
    serviceList: any;

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.fetchFlightList();
        this.fetchStaffList();
        this.fetchAircraftList();
        this.fetchAgentList();
    }

    update(element) {
        this.dateTimeExample = new Date(element.departureTime);
        this.isCreate = false;
        this.flight = element;
    }


    async viewCargo(element) {
        let cargoList = element.cargo;
        for (let item of cargoList) {
            let cargoInfo = await this.http.get(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${item.id}`,
                {withCredentials: true}
            ).toPromise();
            this.cargo.append(cargoInfo);
        }
    }

    async viewService(element) {
        let service = element.service;
        for (let item of service) {
            let serviceInfo = await this.http.get(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${item.id}`,
                {withCredentials: true}
            ).toPromise();
            this.serviceList.append(serviceInfo);
        }
    }

    create() {
        this.isCreate = true;
        this.dateTimeExample = new Date();
        this.flight = {
            departureTime: '',
            id: (new Date()).getTime()+'',
            paxCount: 0,
            origin: '',
            destination: '',
            flightNumber:'',
            company: 'Airline1',
            status: 'SCHEDULED',
            cabinCrew: [{}],
            cargo: [{}],
            service: [{}],
            aircraft: {},
            collectCompany: {},
            deliverCompany: {}
        };
    }

    processFlight() {
        if (this.isCreate)
            this.addFlight();
        else
            this.editFlight();
    }

    async addFlight() {
        this.flight.departureTime = this.dateTimeExample;

        console.log(this.flight);
        console.log(typeof(this.flight.cabinCrew));

        await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            this.flight,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchFlightList();
    }

    async editFlight() {
        this.flight.departureTime = this.dateTimeExample;
        await this.http.put(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight/${this.flight.id}`,
            this.flight,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchFlightList();
    }

    async cancelFlight() {
        this.flight.status = 'CANCELLED';
        await this.http.put(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight/${this.flight.id}`,
            this.flight,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchFlightList();
    }

    async acceptService(service) {
        await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.HandleFlightServiceRequest`,
            service,
            {withCredentials: true})
            .toPromise();
        service.status = 'APPROVED';
    }

    async fetchFlightList() {
        let flightList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            {withCredentials: true}
        ).toPromise();

        flightList = flightList.map((flight) => {
            //Remove Cabin Crew NameSpace
            if(flight.cabinCrew) {
               flight.cabinCrew = flight.cabinCrew.replace(this.blockChainService.AIRLINE_EMPLOYEE, "");
           }
           
           //Remove GHA Company Namespace
            if(flight.deliverCompany) {
                flight.deliverCompany = flight.deliverCompany.replace(this.blockChainService.GHA_COMPANY, "");
            }

            if(flight.collectCompany) {
                flight.collectCompany = flight.collectCompany.replace(this.blockChainService.GHA_COMPANY, "");
            }

            //Remove Aircraft NameSpace
            if(flight.aircraft) {
                flight.aircraft = flight.aircraft.replace(this.blockChainService.AIRCRAFT, "");
            }

           return flight;
        });

        console.log(flightList);

        this.loadDataInTable(flightList);
    }

    async fetchStaffList() {
        this.crewList = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AirlineEmployee`,
            {withCredentials: true}
        ).toPromise();
        this.crewList = this.crewList.filter((staff) => {
            return staff.role == 'STAFF'
        });

    }

    async fetchAgentList() {
        this.agentList = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.GHACompany`,
            {withCredentials: true}
        ).toPromise();
    }

    async fetchAircraftList() {
        let airCraftList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Aircraft`,
            {withCredentials: true}
        ).toPromise();

        this.aircraftList = airCraftList;

    }

    loadDataInTable(flightList) {
        this.dataSource = new MatTableDataSource<any>(flightList);
        this.dataSource.paginator = this.paginator;
    }


}
