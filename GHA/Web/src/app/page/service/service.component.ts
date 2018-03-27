import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
    displayedColumns = ['id', 'Type', 'Description', 'Status', 'Option'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
    service: any = {
        type: '',
        id: '',
        description: '',
        status: '',
        staff: '',
        flight: '',
    };
    isCreate = false;

    staff = [{id: '001', name: 'Lily'}, {id: '002', name: 'Susan'}, {id: '003', name: 'Helen'}, {id: '004', name: 'Mary'}];
    flight = [{id: 'SQ851'}, {id: 'SQ852'}, {id: 'SQ800'}, {id: 'SQ801'}];

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
        this.service = {
            type: '',
            id: '',
            description: '',
            status: '',
            staff: '',
            flight: '',
        };
    }

    update(element) {
        this.isCreate = false;
        this.service = element;
    }

}

export interface Service {
    type: string;
    id: string;
    description: string;
    status: string
    staff: string
    flight: string
}

const ELEMENT_DATA: Service[] = [
    {id: '9VSTC', type: 'Food', description: 'Provide Catering', status: 'PENDING', staff: '001', flight: 'SQ851'},
    {id: '9VPTV', type: 'Utilities', description: 'Clean Aircraft', status: 'APPROVED', staff: '002', flight: 'SQ851'},
    {id: '9VSSG', type: 'Utilities', description: 'Clean Aircraft', status: 'REJECTED', staff: '002', flight: 'SQ852'},
    {id: '9VOTS', type: 'Food', description: 'Provide Catering', status: 'DONE', staff: '003', flight: 'SQ852'},
    {id: '9VOTM', type: 'Food', description: 'Provide Catering', status: 'NOT DONE', staff: '004', flight: 'SQ800'},

];
