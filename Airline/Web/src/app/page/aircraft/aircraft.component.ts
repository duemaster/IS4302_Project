import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {HttpClient} from "@angular/common/http";
import {SettingService} from "../../service/setting/setting.service";
import {AuthService} from "../../service/auth.service";

@Component({
    selector: 'app-aircraft',
    templateUrl: './aircraft.component.html',
    styleUrls: ['./aircraft.component.scss']
})
export class AircraftComponent implements AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.fetchAircraftList();
    }


    constructor(private http: HttpClient,
                private service: SettingService,
                public authService: AuthService) {
    }

    public loading = false;

    displayedColumns = ['id', 'Model', 'PaxCapacity', 'CargoCapacity', 'Option'];
    dataSource = new MatTableDataSource([]);
    aircraft: any;
    isCreate = false;

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    create() {
        this.isCreate = true;
    }

    processAircraft() {
        if (this.isCreate)
            this.addAircraft();
        else
            this.editAircraft();
    }

    async addAircraft() {
        this.loading = true;

        await this.http.post(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AddAircraft`,
            this.aircraft,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        await this.fetchAircraftList();
        this.loading = false;
    }

    async editAircraft() {
        this.loading = true;

        let aircraftToEdit = Object.assign({}, this.aircraft);
        delete aircraftToEdit["id"];

        await this.http.put(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Aircraft/${this.aircraft.id}`,
            aircraftToEdit,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        await this.fetchAircraftList();
        this.loading = false;
    }

    async deleteAircraft() {
        this.loading = true;
        await this.http.delete(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Aircraft/${this.aircraft.id}`,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchAircraftList();
        this.loading = false;
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


