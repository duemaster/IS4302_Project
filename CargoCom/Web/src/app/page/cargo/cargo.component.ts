import { Component, OnInit, ViewChild } from '@angular/core';
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
export class CargoComponent implements OnInit {

  constructor(private http: HttpClient,
              private service: SettingService,
              public authService: AuthService,
              public blockChainService: BlockChainService) { }

  ngOnInit() {
  }

    displayedColumns = ['CargoNo', 'ItemType', 'Weight', 'Status', 'Option'];
    dataSource = new MatTableDataSource([]);

    cargo = {
        id: '',
        description: '',
        weight: 0,
        status: 'PENDING',
        company:'Cargo1',
        flight:{},
        request:{}
    };

    isCreate = false;

    flight = {
        departureTime: new Date(),
        id: '',
        flightNumber:'',
        origin: '',
        destination: '',
        paxCount: 0,
        status: '',
        aircraft: {},
        collectCompany: {},
        deliverCompany: {}
    };

    flightList:any;

    availFlight=[
        {id:''},
        {flightNumber:''},
        {departureTime: new Date()}
    ];

    cargoRequest:any;
    isPending = true;

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.fetchCargoList();
        this.fetchFlightList();
    }

    update(element){
        this.isCreate = false;
        this.cargo = element;
    }

    async viewFlight(flightId){
        this.flight = this.flightList.filter((flight) => {
            return flightId === flight.id;
        })[0];

    }

    create() {
        this.isCreate = true;
        this.cargo = {
            id: (new Date()).getTime()+'',
            description: '',
            weight: 0,
            status: '',
            company:'Cargo1',
            flight:{},
            request:{}
        };
    }

    async request(element){
        this.cargo = element;
        if(this.cargo.request){
            this.cargoRequest = this.http.get(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CargoRequest${this.cargo.request}`,
                {withCredentials: true})
                .toPromise();
            if(this.cargoRequest.status === 'PENDING')
                this.isPending = true;
            else
                this.isPending = false;
        }else {
            this.isPending = true;
            this.cargoRequest = {
                id: (new Date()).getTime()+'',
                description: '',
                origin: '',
                destination: '',
                status: 'PENDING',
                earlyDepartureTime: new Date(),
                lateDepartureTime: new Date(),
                cargo: this.cargo.id
            };
        }
    }

    processCargo() {
        if (this.isCreate)
            this.addCargo();
        else
            this.editCargo();
    }

    async addCargo() {
        await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo`,
            this.cargo,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchCargoList();
    }

    async addRequest() {
        await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CargoRequest`,
            this.cargoRequest,
            {withCredentials: true})
            .toPromise();

    }


    async editCargo() {
        await this.http.put(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${this.cargo.id}`,
            this.cargo,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchCargoList();
    }

    async editRequest() {
        await this.http.put(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CargoRequest/${this.cargoRequest.id}`,
            this.cargoRequest,
            {withCredentials: true})
            .toPromise();
    }

    async cancelRequest() {
        this.cargoRequest.status = 'CANCELLED';
        await this.http.put(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CargoRequest/${this.cargoRequest.id}`,
            this.cargoRequest,
            {withCredentials: true})
            .toPromise();
        this.cargo.request = {};
        this.editCargo();
    }

    async deleteCargo() {
        await this.http.delete(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${this.cargo.id}`,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchCargoList();
    }

    async fetchFlightList() {
        let flightList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            {withCredentials: true}
        ).toPromise();

        flightList = flightList.map((flight) => {
            //Remove Cabin Crew NameSpace
            if(flight.cabinCrews) {
                flight.cabinCrews = flight.cabinCrews.map((cabinCrew) => {
                    return cabinCrew.replace(this.blockChainService.AIRLINE_EMPLOYEE, "");
                });
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

        this.flightList = flightList;

        for(let flight of this.flightList){
            if(flight.status === 'SCHEDULED')
                this.availFlight.push({id:this.flight.id},{flightNumber:this.flight.flightNumber},{departureTime:this.flight.departureTime});
        }
    }

    async fetchCargoList() {
        let cargoList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo`,
            {withCredentials: true}
        ).toPromise();
        this.loadDataInTable(cargoList)

    }

    loadDataInTable(cargoList) {
        this.dataSource = new MatTableDataSource<any>(cargoList);
        this.dataSource.paginator = this.paginator;
    }
}

