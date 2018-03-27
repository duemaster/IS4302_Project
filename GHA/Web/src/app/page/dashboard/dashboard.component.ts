import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    displayedColumns = ['Staff Id', 'Role', 'Name', "Option"];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
    staff: any = {
        id: '',
        name: '',
        role: ''
    };
    isCreate =false;

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }


    create() {
        this.isCreate = true;
        this.staff = {
            name: '',
            id: '',
            role: '',
        };
    }

    update(element) {
        this.isCreate = false;
        this.staff = element;
    }

}



export interface Staff {
    name: string;
    id: string;
    role: string;
}

const ELEMENT_DATA: Staff[] = [
    {id: '001', name: 'Apple', role: 'Officer'},
    {id: '002', name: 'Ball', role: 'Staff'},
    {id: '003', name: 'Cat', role: 'Staff'},
    {id: '004', name: 'Dog', role: 'Staff'},

];
