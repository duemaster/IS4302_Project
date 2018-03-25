import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-flight',
  templateUrl: './cargorequest.component.html',
  styleUrls: ['./cargorequest.component.scss']
})
export class CargoRequestComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

    cargoInfo = [{item:'furniture', weight:40, owner: 'SIA Cargo', status:'Ready'},
        {item:'toys', weight:70, owner: 'Cathay Cargo', status:'Ready'},];

    serviceInfo = [{item:'Business Class Meal X30', agent:'SATS', status:'Approved'},
        {item:'Economic Class Meal X150', agent:'SATS', status:'Approved'},
        {item:'Blanket + Pillow X200', agent:'SATS', status:'Approved'},
        {item:'NewsPaper X100', agent:'DNATA', status:'Approved'},];

    displayedColumns = ['FlightNo', 'Date', 'Departure', 'Landing','Status', 'Option'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);

    flight = {
        date: '',
        flightNo: '',
        departure: '',
        landing: '',
        status: '',
        crew:'',
    };

    isCreate = false;

    crew = [{id: '001', name: 'Lily'}, {id: '002', name: 'Susan'}, {id: '003', name: 'Helen'}, {id: '004', name: 'Mary'}];

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    update(element){
        this.isCreate = false;
        this.flight = element;
    }

    create() {
        this.isCreate = true;
        this.flight = {
            date: '',
            flightNo: '',
            departure: '',
            landing: '',
            status: '',
            crew:'',
        };
    }


}
export interface Flight {
    date: string;
    flightNo: string;
    departure: string;
    landing: string;
    crew: string;
    status: string
}

const ELEMENT_DATA: Flight[] = [
    {flightNo: 'SQ851', date: '01-03-2018 08:20', departure: 'SIN', landing: 'CAN', status: 'Scheduled', crew: '001'},
    {flightNo: 'SQ852', date: '01-03-2018 13:10', departure: 'CAN', landing: 'SIN', status: 'Scheduled', crew: '002'},
    {flightNo: 'SQ800', date: '02-03-2018 02:20', departure: 'SIN', landing: 'PEK', status: 'Scheduled', crew: '003'},
    {flightNo: 'SQ801', date: '02-03-2018 10:30', departure: 'PEK', landing: 'SIN', status: 'Scheduled', crew: '004'},

];