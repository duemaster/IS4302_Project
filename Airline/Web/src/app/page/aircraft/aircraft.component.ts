import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {HttpClient} from "@angular/common/http";
import {SettingService} from "../../service/setting/setting.service";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-aircraft',
  templateUrl: './aircraft.component.html',
  styleUrls: ['./aircraft.component.scss']
})
export class AircraftComponent implements OnInit {

  constructor(private http: HttpClient,
              private service: SettingService,
              public authService: AuthService) { }

  ngOnInit() {
  }
    displayedColumns = ['id', 'Model', 'PaxCapacity', 'CargoCapacity', 'Option'];
    dataSource = new MatTableDataSource([]);
    aircraft: any = {
        model: '',
        id: '',
        passengerCapacity: 0,
        cargoCapacity: 0,
    };
    isCreate = false;

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }




    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.fetchAircraftList();
    }

    create() {
        this.isCreate = true;
        this.aircraft = {
            model: '',
            id: '',
            passengerCapacity: 0,
            cargoCapacity: 0,
        };
    }

    processAircraft() {
        if (this.isCreate)
            this.addAircraft();
        else
            this.editAircraft();
    }

    async addAircraft() {
        await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Aircraft`,
            this.aircraft,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchAircraftList();
    }

    async editAircraft() {


        await this.http.put(
            `${this.service.ENDPOINT}/user/${this.authService.admin.id}/api/org.airline.airChain.Aircraft/${this.aircraft.id}`,
            this.aircraft,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchAircraftList();
    }

    async deleteAircraft() {
        await this.http.delete(
            `${this.service.ENDPOINT}/user/${this.authService.admin.id}/api/org.airline.airChain.Aircraft/${this.aircraft.id}`,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchAircraftList();
    }

    update(element) {
        this.isCreate = false;
        this.aircraft = element;
    }

    async fetchAircraftList() {
        let aircraftList = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Aircraft`,
            {withCredentials: true}
        ).toPromise();

        this.loadDataInTable(aircraftList);
    }

    loadDataInTable(aircraftList) {
        this.dataSource = new MatTableDataSource<any>(aircraftList);
        this.dataSource.paginator = this.paginator;
    }

}


