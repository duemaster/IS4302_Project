import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {BlockChainService} from "../../service/blockchain/block-chain.service";
import {AuthService} from "../../service/auth.service";
import {SettingService} from "../../service/setting/setting.service";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-flight',
    templateUrl: './cargo.component.html',
    styleUrls: ['./cargo.component.scss']
})
export class CargoComponent implements AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;

    async ngAfterViewInit() {
        //this.loading = true;
        this.dataSource.paginator = this.paginator;
        await this.fetchCargoList();
        await this.fetchFlightList();
        //this.loading = false;
    }

    constructor(private http: HttpClient,
                public service: SettingService,
                public authService: AuthService,
                public blockChainService: BlockChainService) {
    }

    displayedColumns = ['ItemType', 'Weight', 'Status', 'Flight', 'Option'];
    dataSource = new MatTableDataSource([]);

    cargo: any;

    isCreate = false;


    assignedFlightId: any;
    flight: any;
    flightList: any;

    availFlight = [
        {id: '', flightNumber: '', departureTime: new Date()}
    ];

    public loading = false;
    cargoRequest: any;
    isPending = true;

    isError = false;
    errorMessage: string;
    windowObj:any = window;

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    update(element) {
        this.isError = false;
        this.isCreate = false;
        this.cargo = element;
        this.assignedFlightId = this.cargo.flight;
    }

    async viewFlight(flightId) {
        this.flight = this.flightList.filter((flight) => {
            return flightId === flight.id;
        })[0];
    }

    create() {
        this.isError = false;
        this.isCreate = true;
        this.cargo = {};
    }

    processCargo() {
        if(!this.cargo.weight || !this.cargo.description){
            this.isError = true;
            this.errorMessage = 'Please fill in all required fields';
        }else {
            this.isError = false;
            if (this.isCreate)
                this.addCargo();
            else
                this.editCargo();
            return this.windowObj.jQuery('.modal-backdrop').click();
        }
    }

    async addCargo() {
        this.loading = true;
        this.cargo.id = new Date().getTime().toString();

        //Create Cargo
        await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AddCargo`,
            this.cargo,
            {withCredentials: true})
            .toPromise();

        //If there is flight
        if (this.assignedFlightId) {
            let response = await this.assignCargoToFlight(this.cargo.id, this.assignedFlightId);
            this.assignedFlightId = null;
            console.log(response);
        }

        //Refresh Data Table
        await this.fetchCargoList();
        this.loading = false;

    }

    async editCargo() {
        this.loading = true;

        let cargoToEdit = Object.assign({}, this.cargo);
        delete cargoToEdit["id"];

        let response = await this.http.put(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${this.cargo.id}`,
            cargoToEdit,
            {withCredentials: true})
            .toPromise();

        console.log(response);

        //If there is flight
        if (this.assignedFlightId) {
            await this.assignCargoToFlight(this.cargo.id, this.assignedFlightId);
        }

        //Refresh Data Table
        await this.fetchCargoList();
        this.assignedFlightId = null;
        this.loading = false;
    }

    async deleteCargo() {
        this.loading = true;
        await this.http.delete(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${this.cargo.id}`,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        await this.fetchCargoList();
        this.loading = false;
    }

    private async assignCargoToFlight(cargoId: string, flightId: string) {
        await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AssignCargoToFlight`,
            {
                cargo: `${this.blockChainService.CARGO}#${cargoId}`,
                flight: `${this.blockChainService.FLIGHT}#${flightId}`
            },
            {withCredentials: true}
        ).toPromise();
    }

    //Cargo Request
    async request(element) {
        this.cargo = element;
        if (this.cargo.request) {
            this.cargoRequest = this.http.get(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CargoRequest${this.cargo.request}`,
                {withCredentials: true})
                .toPromise();
            if (this.cargoRequest.status === 'PENDING')
                this.isPending = true;
            else
                this.isPending = false;
        } else {
            this.isPending = true;
            this.cargoRequest = {
                id: `${(new Date()).getTime()}`,
                description: '',
                origin: '',
                destination: '',
                status: 'PENDING',
                earlyDepartureTime: new Date(),
                lateDepartureTime: new Date(),
                cargo: `${this.blockChainService.CARGO}#${this.cargo.id}`
            };
        }
    }

    async addRequest() {
        if(this.cargoRequest.description === '' || this.cargo.origin === '' || this.cargo.destination === ''){
            this.isError = true;
            this.errorMessage = 'Please fill in all required fields';
        }else if(this.cargo.lateDepartureTime.getTime()-this.cargo.earlyDepartureTime.getTime() < 0){
            this.isError = true;
            this.errorMessage = 'Invalid Date Time';
        }else {
            this.isError = false;
            await this.http.post(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CreateCargoRequest`,
                this.cargoRequest,
                {withCredentials: true})
                .toPromise();
            return this.windowObj.jQuery('.modal-backdrop').click();
        }

    }

    async editRequest() {
        if(this.cargoRequest.description === '' || this.cargo.origin === '' || this.cargo.destination === ''){
            this.isError = true;
            this.errorMessage = 'Please fill in all required fields';
        }else if(this.cargo.lateDepartureTime.getTime()-this.cargo.earlyDepartureTime.getTime() < 0){
            this.isError = true;
            this.errorMessage = 'Invalid Date Time';
        }else {
            this.isError = false;
            await this.http.put(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CreateCargoRequest/${this.cargoRequest.id}`,
                this.cargoRequest,
                {withCredentials: true})
                .toPromise();
            return this.windowObj.jQuery('.modal-backdrop').click();
        }
    }

    async cancelRequest() {
        this.cargoRequest.status = 'CANCELLED';
        await this.http.put(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CreateCargoRequest/${this.cargoRequest.id}`,
            this.cargoRequest,
            {withCredentials: true})
            .toPromise();
        this.cargo.request = '';
        this.editCargo();
    }

    async fetchFlightList() {
        let flightList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            {withCredentials: true}
        ).toPromise();

        flightList = flightList.map((flight) => {
            //Remove Cabin Crew NameSpace
            if (flight.cabinCrew) {
                flight.cabinCrew = flight.cabinCrew.replace(`${this.blockChainService.AIRLINE_EMPLOYEE}#`, "");
            }

            //Remove GHA Company Namespace
            if (flight.deliverCompany) {
                flight.deliverCompany = flight.deliverCompany.replace(`${this.blockChainService.GHA_COMPANY}#`, "");
            }

            if (flight.collectCompany) {
                flight.collectCompany = flight.collectCompany.replace(`${this.blockChainService.GHA_COMPANY}#`, "");
            }

            //Remove Aircraft NameSpace
            if (flight.aircraft) {
                flight.aircraft = flight.aircraft.replace(`${this.blockChainService.AIRCRAFT}#`, "");
            }

            return flight;
        });

        console.log(flightList);

        this.availFlight = [];
        this.flightList = flightList;

        for (let flight of this.flightList) {
            if (flight.status === 'SCHEDULED')
                this.availFlight.push({
                    id: flight.id,
                    flightNumber: flight.flightNumber,
                    departureTime: flight.departureTime
                });
        }
        console.log(this.availFlight);
    }

    async fetchCargoList() {
        let cargoList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo`,
            {withCredentials: true}
        ).toPromise();

        //Remove namespace
        cargoList = cargoList.map((cargo) => {
            if (cargo.flight)
                cargo.flight = cargo.flight.replace(`${this.blockChainService.FLIGHT}#`, "");
            return cargo;
        });

        this.loadDataInTable(cargoList)

    }

    loadDataInTable(cargoList) {
        this.dataSource = new MatTableDataSource<any>(cargoList);
        this.dataSource.paginator = this.paginator;
    }
}

