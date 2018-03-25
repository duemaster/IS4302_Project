import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';

@Component({
  selector: 'app-aircraft',
  templateUrl: './aircraft.component.html',
  styleUrls: ['./aircraft.component.scss']
})
export class AircraftComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
    displayedColumns = ['id', 'Model', 'Manufacturer', 'CargoCapacity', 'Option'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
    aircraft: any = {
        model: '',
        id: '',
        manufacturer: '',
        capacity: 0,
    };
    isCreate = false;

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
        this.aircraft = {
            model: '',
            id: '',
            manufacturer: '',
            capacity: 0,
        };
    }

    update(element) {
        this.isCreate = false;
        this.aircraft = element;
    }

}

export interface Aircraft {
    model: string;
    id: string;
    manufacturer: string;
    capacity: number
}

const ELEMENT_DATA: Aircraft[] = [
    {id: '9VSTC', model: '777-300', manufacturer: 'Boeing', capacity:120},
    {id: '9VPTV', model: '333-300', manufacturer: 'Airbus', capacity:100},
    {id: '9VSSG', model: '380-800', manufacturer: 'Airbus', capacity:200},
    {id: '9VOTS', model: '787-900', manufacturer: 'Boeing', capacity:160},

];
