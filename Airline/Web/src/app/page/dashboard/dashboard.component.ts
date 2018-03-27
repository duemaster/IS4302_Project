import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {SettingService} from '../../service/setting/setting.service';
import {AuthService} from "../../service/auth.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

    displayedColumns = ['Staff Id', 'Role', 'Name', 'Option'];
    dataSource = new MatTableDataSource([]);
    staff: any = {
        password: '',
        name: '',
        role: ''
    };

    isCreate = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private http: HttpClient,
                private service: SettingService,
                public authService: AuthService) {
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.getStaffList();
    }

    create() {
        this.isCreate = true;
        this.staff = {
            name: '',
            password: '',
            role: '',
        };
    }

    async addStaff() {
        //Add Staff
        await this.http.post(
            this.service.ENDPOINT + '/user',
            this.staff,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.getStaffList();
    }

    update(element) {
        this.isCreate = false;
        this.staff = element;
    }

    async getStaffList() {
        let staffList = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AirlineEmployee`,
            {withCredentials: true}
        ).toPromise();

        this.loadDataInTable(staffList);
    }

    loadDataInTable(staffList) {
        this.dataSource = new MatTableDataSource<any>(staffList);
        this.dataSource.paginator = this.paginator;
    }
}


// export interface Staff {
//     name: string;
//     id: string;
//     role: string;
// }
//
// const ELEMENT_DATA: Staff[] = [
//     {id: '001', name: 'Hydrogen', role: 'officer'},
//     {id: '002', name: 'Helium', role: 'crew'},
//     {id: '003', name: 'Lithium', role: 'crew'},
//     {id: '004', name: 'Beryllium', role: 'crew'},
//
// ];
