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
    displayedColumns = ['id', 'Type', 'Description', 'Status', 'Flight', 'Option'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
    service: any = {
        type: '',
        id: '',
        description: '',
        status: '',
        staff: '',
        flight: {},
        flightList: ''
    };
    isCreate = false;

    flight = {
        flightNo: '', date: '', departure: '', landing: '', status: '', crew: ''
    };

    staff = [{id: '001', name: 'Lily'}, {id: '002', name: 'Susan'}, {id: '003', name: 'Helen'}, {id: '004', name: 'Mary'}];
    flightList = [{id: 'SQ851'}, {id: 'SQ852'}, {id: 'SQ800'}, {id: 'SQ801'}];
    // flight = [{flightNo: 'SQ851', date: '01-03-2018 08:20', departure: 'SIN', landing: 'CAN', status: 'Scheduled', crew: '001'},
    //     {flightNo: 'SQ852', date: '01-03-2018 13:10', departure: 'CAN', landing: 'SIN', status: 'Scheduled', crew: '002'},
    //     {flightNo: 'SQ800', date: '02-03-2018 02:20', departure: 'SIN', landing: 'PEK', status: 'Scheduled', crew: '003'},
    //     {flightNo: 'SQ801', date: '02-03-2018 10:30', departure: 'PEK', landing: 'SIN', status: 'Scheduled', crew: '004'},]

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
            flight: {},
        };
    }

    update(element) {
        this.isCreate = false;
        this.service = element;
    }

    viewFlight(element){
        this.flight = element;
    }
}

export interface Service {
    type: string;
    id: string;
    description: string;
    status: string
    staff: string
    flight: {}
}

const ELEMENT_DATA: Service[] = [
    {id: '9VSTC', type: 'Food', description: 'Provide Catering', status: 'PENDING', staff: '001', flight: {flightNo: 'SQ851', date: '01-03-2018 08:20', departure: 'SIN', landing: 'CAN', status: 'Scheduled', crew: '001'}},
    {id: '9VPTV', type: 'Utilities', description: 'Clean Aircraft', status: 'APPROVED', staff: '002', flight: {flightNo: 'SQ851', date: '01-03-2018 08:20', departure: 'SIN', landing: 'CAN', status: 'Scheduled', crew: '001'}},
    {id: '9VSSG', type: 'Utilities', description: 'Clean Aircraft', status: 'REJECTED', staff: '002', flight: {flightNo: 'SQ852', date: '01-03-2018 13:10', departure: 'CAN', landing: 'SIN', status: 'Scheduled', crew: '002'}},
    {id: '9VOTS', type: 'Food', description: 'Provide Catering', status: 'DONE', staff: '003', flight: {flightNo: 'SQ852', date: '01-03-2018 13:10', departure: 'CAN', landing: 'SIN', status: 'Scheduled', crew: '002'}},
    {id: '9VOTM', type: 'Food', description: 'Provide Catering', status: 'NOT DONE', staff: '004', flight: {flightNo: 'SQ800', date: '02-03-2018 02:20', departure: 'SIN', landing: 'PEK', status: 'Scheduled', crew: '003'}},

];
