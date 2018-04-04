import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {SettingService} from '../../service/setting/setting.service';
import {AuthService} from '../../service/auth.service';
import {BlockChainService} from '../../service/blockchain/block-chain.service';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-flight',
    templateUrl: './flight.component.html',
    styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements AfterViewInit {

    constructor(private http: HttpClient,
                private service: SettingService,
                public authService: AuthService,
                public blockChainService: BlockChainService) {
    }

    displayedColumns = ['FlightNo', 'Date', 'Departure', 'Landing', 'Status', 'Option'];
    dataSource = new MatTableDataSource([]);
    dateTimeExample;

    public loading = false;
    flight = {
        departureTime: '',
        id: '',
        flightNumber: '',
        origin: '',
        destination: '',
        paxCount: 0,
        company: 'Airline1',
        status: 'SCHEDULED',
        cabinCrew: '',
        cargo: [],
        service: [],
        aircraft: '',
        collectCompany: '',
        deliverCompany: ''
    };

    cargoList: any;

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
        // Load Data
        this.fetchFlightList();
        this.fetchStaffList();
        this.fetchAircraftList();
        this.fetchAgentList();
    }

    update(element) {
        this.dateTimeExample = new Date(element.departureTime);
        this.isCreate = false;
        this.flight = element;

        console.log(this.flight);
    }

    async viewCargo(flight) {
        //If Flight currently have not cargo attached
        if (!flight.cargos) {
            this.cargoList = [];
            return;
        }

        this.cargoList = flight.cargos.flatMap(async (cargo) => {
            cargo.id = cargo.id.replace(`${this.blockChainService.CARGO}#`, '');
            return await this.http.get(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${cargo.id}`,
                {withCredentials: true}
            ).toPromise();
        });
    }

    async viewService(flight) {

        //If Flight currently have not service attached
        if (!flight.services) {
            this.serviceList = [];
            return;
        }

        this.serviceList = [];
        flight.services.forEach(async (service) => {
            service = service.replace(`${this.blockChainService.SERVICE}#`, '');
            let serviceResponse:any = await this.http.get(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Service/${service}`,
                {withCredentials: true}
            ).toPromise();
            serviceResponse.company = serviceResponse.company.replace(`${this.blockChainService.GHA_COMPANY}#`,'');

            this.serviceList.push(serviceResponse);
        });

        console.log(this.serviceList);
    }

    create() {
        this.isCreate = true;
        this.dateTimeExample = new Date();
        this.flight = {
            departureTime: '',
            id: (new Date()).getTime() + '',
            paxCount: 0,
            origin: '',
            destination: '',
            flightNumber: '',
            company: 'Airline1',
            status: 'SCHEDULED',
            cabinCrew: '',
            cargo: [],
            service: [],
            aircraft: '',
            collectCompany: '',
            deliverCompany: ''
        };
    }

    processFlight() {
        if (this.isCreate)
            this.addFlight();
        else
            this.editFlight();
    }

    async addFlight() {
        this.loading = true;
        this.flight.departureTime = this.dateTimeExample;
        let processedFlight = this.addNameSpace(this.flight);
        await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            processedFlight,
            {withCredentials: true})
            .toPromise();
        //Refresh Data Table
        this.fetchFlightList();
        this.loading = false;
    }

    async editFlight() {
        this.loading = true;
        this.flight.departureTime = this.dateTimeExample;
        await this.updateFlight(this.flight);
        //Refresh Data Table
        this.fetchFlightList();
        this.loading = false;
    }

    async cancelFlight() {
        this.loading = true;
        this.flight.status = 'CANCELLED';

        await this.updateFlight(this.flight);

        //Refresh Data Table
        this.fetchFlightList();
        this.loading = false;
    }

    async acceptService(service) {
        this.loading = true;
        console.log(service);
        let response = await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.HandleFlightServiceRequest`,
            {service: service.id, isApproved: true},
            {withCredentials: true})
            .toPromise();

        console.log(response);
        //Update Service Status locally
        service.status = 'APPROVED';
        this.loading = false;
    }


    private async updateFlight(flight) {
        //remove flightId
        let flightToUpdate = Object.assign({}, flight);
        delete flightToUpdate['id'];

        flightToUpdate = this.addNameSpace(flightToUpdate);

        await this.http.put(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight/${this.flight.id}`,
            flightToUpdate,
            {withCredentials: true})
            .toPromise();
    }

    private async fetchFlightList() {
        let flightList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            {withCredentials: true}
        ).toPromise();

        flightList = flightList.map((flight) => {
            //Remove Cabin Crew NameSpace
            if (flight.cabinCrew) {
                flight.cabinCrew = flight.cabinCrew.replace(`${this.blockChainService.AIRLINE_EMPLOYEE}#`, '');
            }

            //Remove GHA Company Namespace
            if (flight.deliverCompany) {
                flight.deliverCompany = flight.deliverCompany.replace(`${this.blockChainService.GHA_COMPANY}#`, '');
            }

            if (flight.collectCompany) {
                flight.collectCompany = flight.collectCompany.replace(`${this.blockChainService.GHA_COMPANY}#`, '');
            }

            //Remove Aircraft NameSpace
            if (flight.aircraft) {
                flight.aircraft = flight.aircraft.replace(`${this.blockChainService.AIRCRAFT}#`, '');
            }

            return flight;
        });

        this.loadDataInTable(flightList);
    }

    private async fetchStaffList() {
        this.crewList = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AirlineEmployee`,
            {withCredentials: true}
        ).toPromise();
        this.crewList = this.crewList.filter((staff) => {
            return staff.role == 'STAFF';
        });

    }

    private async fetchAgentList() {
        this.agentList = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.GHACompany`,
            {withCredentials: true}
        ).toPromise();
    }

    private async fetchAircraftList() {
        this.aircraftList = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Aircraft`,
            {withCredentials: true}
        ).toPromise();
    }

    private loadDataInTable(flightList) {
        this.dataSource = new MatTableDataSource<any>(flightList);
        this.dataSource.paginator = this.paginator;
    }

    private addNameSpace(flight) {
        //Add NameSpaces
        flight.aircraft = `${this.blockChainService.AIRCRAFT}#${flight.aircraft}`;
        flight.company = `${this.blockChainService.AIRLINE_COMPANY}#${flight.company}`;
        flight.cabinCrew = `${this.blockChainService.AIRLINE_EMPLOYEE}#${flight.cabinCrew}`;
        flight.collectCompany = `${this.blockChainService.GHA_COMPANY}#${flight.collectCompany}`;
        flight.deliverCompany = `${this.blockChainService.GHA_COMPANY}#${flight.deliverCompany}`;

        console.log(flight);
        return flight;
    };
}
