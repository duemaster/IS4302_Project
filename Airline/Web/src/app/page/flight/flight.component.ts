import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import { NgxDateTimePickerModule } from  'ngx-date-time-picker';
import {HttpClient} from "@angular/common/http";
import {SettingService} from "../../service/setting/setting.service";
import {AuthService} from "../../service/auth.service";
import moment = require("moment");

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {

  constructor(private http: HttpClient,
              private service: SettingService,
              public authService: AuthService) { }

  ngOnInit() {
  }


    displayedColumns = ['FlightNo', 'Date', 'Departure', 'Landing','Status', 'Option'];
    dataSource = new MatTableDataSource([]);

    flight = {
        departureTime: '',
        id: '',
        origin: '',
        destination: '',
        paxCount: 0,
        status: 'SCHEDULED',
        crew:[{}],
        cargo:[{}],
        service:[{}],
        aircraft:{},
        collectCompany:{},
        deliverCompany: {}
    };

    cargo: any;

    isCreate = false;

    crew: any;
    aircraft: any;
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

    update(element){
        this.isCreate = false;
        this.flight = element;
    }

    getDateTime($event){
        this.flight.departureTime = moment().format('DD/MM/YYYY HH:mm');
    }

    async viewCargo(element){
        let cargoList = element.cargo;
        for(let item of cargoList){
            let cargoInfo = await this.http.get(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${item.id}`,
                {withCredentials: true}
            ).toPromise();
            this.cargo.append(cargoInfo);
        }
    }

    async viewService(element){
        let service = element.service;
        for(let item of service){
            let serviceInfo = await this.http.get(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${item.id}`,
                {withCredentials: true}
            ).toPromise();
            this.serviceList.append(serviceInfo);
        }
    }

    create() {
        this.isCreate = true;
        this.flight = {
            departureTime: '',
            id: '',
            paxCount: 0,
            origin: '',
            destination: '',
            status: 'SCHEDULED',
            crew:[{}],
            cargo:[{}],
            service:[{}],
            aircraft:{},
            collectCompany:{},
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
        await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            this.flight,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchFlightList();
    }

    async editFlight() {

        await this.http.put(
            `${this.service.ENDPOINT}/user/${this.authService.admin.id}/api/org.airline.airChain.Flight/${this.flight.id}`,
            this.flight,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchFlightList();
    }

    async cancelFlight(){
        this.flight.status = 'CANCELLED';
        await this.http.put(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight/${this.flight.id}`,
            this.flight,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchFlightList();
    }

    async acceptService(service){
        await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.HandleFlightServiceRequest`,
            service,
            {withCredentials: true})
            .toPromise();
        service.status ='APPROVED';
    }

    async fetchFlightList(){
        let flightList = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            {withCredentials: true}
        ).toPromise();
        this.loadDataInTable(flightList);
    }

    async fetchStaffList() {
        this.crew = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AirlineEmployee?filter=%7B%22role%22%3A%22STAFF%22%7D`,
            {withCredentials: true}
        ).toPromise();

    }

    async fetchAgentList(){
        this.agentList = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.GHACompany`,
            {withCredentials: true}
        ).toPromise();
    }

    async fetchAircraftList(){
        this.aircraft = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Aircraft`,
            {withCredentials: true}
        ).toPromise();
    }

    loadDataInTable(flightList) {
        this.dataSource = new MatTableDataSource<any>(flightList);
        this.dataSource.paginator = this.paginator;
    }


}
