import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
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

    constructor(private http: HttpClient,
                public setting: SettingService,
                public authService: AuthService,
                public blockChainService: BlockChainService) {
    }

    displayedColumns = ['ItemType', 'Weight', 'Status', 'Flight', 'Option'];
    dataSource = new MatTableDataSource([]);

    cargo: any = {};

    isCreate = false;

    assignedFlightId: any = "";
    flight: any = {};
    flightList: any;

    availFlight = [
        {id: '', flightNumber: '', departureTime: new Date()}
    ];

    public loading = false;
    cargoRequest: any = {};
    isPending = true;

    isError = false;
    errorMessage: string;
    windowObj: any = window;

    async ngAfterViewInit() {
        //this.loading = true;
        this.dataSource.paginator = this.paginator;
        await this.fetchCargoList();
        await this.fetchFlightList();
        //  this.loading = false;
    }

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
        // this.flight = this.flightList.filter((flight) => {
        //     return flightId === flight.id;
        // })[0];

        //Fetch Flight Information
        this.flight = await this.http.get(
            `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight/${flightId}`,
            {withCredentials: true}
        ).toPromise();

        //Remove GHA company namespace
        if(this.flight.collectCompany)
            this.flight.collectCompany = this.flight.collectCompany.replace(`${this.blockChainService.GHA_COMPANY}#`, "");

        if(this.flight.deliverCompany)
            this.flight.deliverCompany = this.flight.deliverCompany.replace(`${this.blockChainService.GHA_COMPANY}#`, "");
    }

    create() {
        this.isError = false;
        this.isCreate = true;
        this.cargo = {};
        this.assignedFlightId = "";
    }

    processCargo() {
        if (!this.cargo.weight || !this.cargo.description) {
            this.isError = true;
            this.errorMessage = 'Please fill in all required fields';
        } else {
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
            `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AddCargo`,
            this.cargo,
            {withCredentials: true})
            .toPromise();

        //If there is flight
        if (this.assignedFlightId && this.assignedFlightId == "") {
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
        await this.updateCargo(cargoToEdit);

        //If there is flight
        if (this.assignedFlightId && this.assignedFlightId != "") {
            await this.assignCargoToFlight(this.cargo.id, this.assignedFlightId);
        }

        //Refresh Data Table
        await this.fetchCargoList();
        this.assignedFlightId = null;
        this.loading = false;
    }

    async deleteCargo() {
        this.loading = true;

        let cargoToDelete = Object.assign({}, this.cargo);
        cargoToDelete.status = "DELETED";
        let deleteResult = await this.updateCargo(cargoToDelete);
        //Refresh Data Table
        await this.fetchCargoList();
        this.loading = false;

        if (!deleteResult) {
            alert("Delete Cargo Failed");
        }
    }

    private async assignCargoToFlight(cargoId: string, flightId: string): Promise<boolean> {
        try {
            await this.http.post(
                `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AssignCargoToFlight`,
                {
                    cargo: `${this.blockChainService.CARGO}#${cargoId}`,
                    flight: `${this.blockChainService.FLIGHT}#${flightId}`
                },
                {withCredentials: true}
            ).toPromise();

            return true;
        } catch (e) {
            return false;
        }
    }

    private async updateCargo(cargo): Promise<boolean> {
        let cargoId = cargo.id;
        delete cargo["id"];

        try {
            await this.http.put(
                `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${cargoId}`,
                cargo,
                {withCredentials: true}
            ).toPromise();
            return true;
        } catch (e) {
            return false;
        }
    }

    //Cargo Request
    async request(element) {
        this.cargo = element;
        this.loading = true;
        console.log(this.cargo);
        if (this.cargo.request) {
            //Remove namespace
            this.cargo.request = this.cargo.request.replace(`${this.blockChainService.CARGO_REQUEST}#`, "");
            this.cargoRequest = await this.http.get(
                `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CargoRequest/${this.cargo.request}`,
                {withCredentials: true})
                .toPromise();

            //Parse Date to correct format
            this.cargoRequest.earlyDepartureTime = new Date(this.cargoRequest.earlyDepartureTime);
            this.cargoRequest.lateDepartureTime = new Date(this.cargoRequest.lateDepartureTime);

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
        this.loading = false;
    }

    async addRequest() {
        if (this.cargoRequest.description === '' || this.cargoRequest.origin === '' || this.cargoRequest.destination === '') {
            this.isError = true;
            this.errorMessage = 'Please fill in all required fields';
        } else if (this.cargoRequest.lateDepartureTime.getTime() - this.cargoRequest.earlyDepartureTime.getTime() < 0) {
            this.isError = true;
            this.errorMessage = 'Invalid Date Time';
        } else {
            this.loading = true;
            this.isError = false;
            await this.http.post(
                `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CreateCargoRequest`,
                this.cargoRequest,
                {withCredentials: true})
                .toPromise();

            this.loading = false;
            return this.windowObj.jQuery('.modal-backdrop').click();
        }

    }

    async editRequest() {
        if (this.cargoRequest.description === '' || this.cargoRequest.origin === '' || this.cargoRequest.destination === '') {
            this.isError = true;
            this.errorMessage = 'Please fill in all required fields';
        } else if (this.cargoRequest.lateDepartureTime.getTime() - this.cargoRequest.earlyDepartureTime.getTime() < 0) {
            this.isError = true;
            this.errorMessage = 'Invalid Date Time';
        } else {
            this.isError = false;
            let isSuccess: boolean = await this.updateCargoRequest(this.cargoRequest);
            if (isSuccess)
                return this.windowObj.jQuery('.modal-backdrop').click();
        }
    }

    async cancelRequest() {
        this.cargoRequest.status = 'CANCELLED';
        await this.updateCargoRequest(this.cargoRequest);
    }

    private async updateCargoRequest(cargoRequest): Promise<boolean> {
        //Remove cargoRequest id
        let editCargoRequest = Object.assign({}, cargoRequest);
        delete editCargoRequest["id"];

        try {
            await this.http.put(
                `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CargoRequest/${cargoRequest.id}`,
                editCargoRequest,
                {withCredentials: true})
                .toPromise();

            return true;
        } catch (e) {
            return false;
        }
    }

    async fetchFlightList() {
        let flightList: any = await this.http.get(
            `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            {withCredentials: true}
        ).toPromise();

        flightList = flightList.map((flight) => {
            //Remove Cabin Crew NameSpace
            if (flight.cabinCrew) {
                flight.cabinCrew = flight.cabinCrew.replace(`${this.blockChainService.AIRLINE_EMPLOYEE}#`, "");
            }

            //Remove GHA Company Namespace
            if (flight.deliverCompany) {
                console.log(flight.deliverCompany);
                flight.deliverCompany = flight.deliverCompany.replace(`${this.blockChainService.GHA_COMPANY}#`, "");
            }

            if (flight.collectCompany) {
                console.log(flight.collectCompany);
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
            `${this.setting.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo`,
            {withCredentials: true}
        ).toPromise();

        //filter cargo only show those that belong to the company
        cargoList = cargoList.filter((cargo) => {
            return cargo.company.replace(`${this.blockChainService.CARGO_COMPANY}#`, "") === this.authService.user_profile.company;
        });

        //Remove namespace
        cargoList = cargoList.map((cargo) => {
            if (cargo.flight) {
                cargo.flight = cargo.flight.replace(`${this.blockChainService.FLIGHT}#`, "");
            }
            return cargo;
        });

        this.loadDataInTable(cargoList)

    }

    loadDataInTable(cargoList) {
        this.dataSource = new MatTableDataSource<any>(cargoList);
        this.dataSource.paginator = this.paginator;
    }
}

