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

    public loading = false;
    displayedColumns = ['Staff Id', 'Role', 'Name', 'Option'];
    dataSource = new MatTableDataSource([]);
    staff: any = {
        password: '',
        name: '',
        role: ''
    };

    isCreate = false;

    isError = false;
    errorMessage: string;

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
        this.fetchStaffList();
    }

    create() {
        this.isError = false;
        this.isCreate = true;
        this.staff = {
            name: '',
            password: '',
            role: '',
        };
    }

    processStaff() {
        if(this.staff.name === '' || this.staff.password === ''){
            this.isError = true;
            this.errorMessage = 'Please fill in all required fields';
        }else {
            this.isError = false;
            if (this.isCreate)
                this.addStaff();
            else
                this.editStaff();
        }
    }

    async addStaff() {
        this.loading = true;
        await this.http.post(
            `${this.service.ENDPOINT}/user/${this.authService.admin.id}/create`,
            this.staff,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchStaffList();
        this.loading = false;
    }

    async editStaff() {
        this.loading = true;
        await this.http.post(
            `${this.service.ENDPOINT}/user/${this.authService.admin.id}/update`,
            this.staff,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchStaffList();
        this.loading = false;
    }

    async deleteStaff() {
        this.loading = true;
        await this.http.post(
            `${this.service.ENDPOINT}/user/${this.authService.admin.id}/delete`,
            this.staff,
            {withCredentials: true})
            .toPromise();

        //Refresh Data Table
        this.fetchStaffList();
        this.loading = false;
    }

    update(element) {
        this.isError = false;
        this.isCreate = false;
        this.staff = element;
    }

    async fetchStaffList() {
        let staffList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AirlineEmployee`,
            {withCredentials: true}
        ).toPromise();

        staffList = staffList.filter((staff) => {return staff.id != this.authService.admin.id});

        this.loadDataInTable(staffList);
    }

    loadDataInTable(staffList) {
        this.dataSource = new MatTableDataSource<any>(staffList);
        this.dataSource.paginator = this.paginator;
    }
}