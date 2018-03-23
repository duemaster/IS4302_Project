import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {

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

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

}
export interface Flight {
    date: string;
    id: string;
    departure: string;
    landing: string;
    status: string
}

const ELEMENT_DATA: Flight[] = [
    {id: 'SQ851', date: '01-03-2018 08:20', departure: 'SIN', landing: 'CAN', status: 'Scheduled'},
    {id: 'SQ852', date: '01-03-2018 13:10', departure: 'CAN', landing: 'SIN', status: 'Scheduled'},
    {id: 'SQ800', date: '02-03-2018 02:20', departure: 'SIN', landing: 'PEK', status: 'Scheduled'},
    {id: 'SQ801', date: '02-03-2018 10:30', departure: 'PEK', landing: 'SIN', status: 'Scheduled'},

];