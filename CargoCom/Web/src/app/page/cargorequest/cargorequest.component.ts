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

    displayedColumns = ['ItemType', 'Owner', 'Departure', 'Destination','DeliveryDate', 'Option'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);

    cargorequest = {
        itemType: '',
        owner: '',
        departure: '',
        destination: '',
        deliveryDate: '',
        flight:''
    };

    isCreate = false;

    availFlight = [{flightNo: 'SQ851', date: '01-03-2018 08:20', departure: 'SIN', landing: 'CAN'},
        {flightNo: 'SQ852', date: '01-03-2018 13:10', departure: 'CAN', landing: 'SIN'},
        {flightNo: 'SQ800', date: '02-03-2018 02:20', departure: 'SIN', landing: 'PEK'},
        {flightNo: 'SQ801', date: '02-03-2018 10:30', departure: 'PEK', landing: 'SIN'}];

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
        this.cargorequest = element;
    }

    create() {
        this.isCreate = true;
        this.cargorequest = {
            itemType: '',
            owner: '',
            departure: '',
            destination: '',
            deliveryDate: '',
            flight:''
        };
    }


}
export interface CargoRequest {
    itemType: string;
    owner: string;
    departure: string;
    destination: string;
    deliveryDate: string;
    flight: string
}

const ELEMENT_DATA: CargoRequest[] = [
    {itemType: 'furniture', owner: '', departure: 'SIN', destination: 'CAN', deliveryDate: '01-03-2018 08:20', flight: ''},
    {itemType: 'toy', owner: '', departure: 'CAN', destination: 'SIN', deliveryDate: '01-03-2018 13:10', flight: ''},
    {itemType: 'electronics', owner: '', departure: 'SIN', destination: 'PEK', deliveryDate: '02-03-2018 02:20', flight: ''},
    {itemType: 'kitchenware', owner: '', departure: 'PEK', destination: 'SIN', deliveryDate: '02-03-2018 10:30', flight: ''},

];