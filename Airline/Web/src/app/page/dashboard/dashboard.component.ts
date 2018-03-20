import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator, MatFormFieldControl} from '@angular/material';

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

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }


    addStaff() {

    }

}

export interface Staff {
    name: string;
    id: string;
    role: string;
}

const ELEMENT_DATA: Staff[] = [
    {id: '001', name: 'Hydrogen', role: 'Officer'},
    {id: '002', name: 'Helium', role: 'Cabin Crew'},
    {id: '003', name: 'Lithium', role: 'Cabin Crew'},
    {id: '004', name: 'Beryllium', role: 'Cabin Crew'},

];
