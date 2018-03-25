import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-flight',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.scss']
})
export class CargoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

    displayedColumns = ['CargoNo', 'ItemType', 'Weight', 'Status', 'Option'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);

    cargo = {
        cargoNo: '',
        itemType: '',
        weight: '',
        status: ''
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

    update(element){
        this.isCreate = false;
        this.cargo = element;
    }

    create() {
        this.isCreate = true;
        this.cargo = {
            cargoNo: '',
            itemType: '',
            weight: '',
            status: ''
        };
    }
}

export interface Cargo {
    cargoNo: string;
    itemType: string;
    weight: string;
    status: string
}

const ELEMENT_DATA: Cargo[] = [
    {cargoNo: '001', itemType: 'Furniture', weight: '31', status: 'Pending'},
    {cargoNo: '002', itemType: 'Toy', weight: '18', status: 'Approved'},
    {cargoNo: '003', itemType: 'Food', weight: '55', status: 'Rejected'},
    {cargoNo: '004', itemType: 'Electronics', weight: '28', status: 'Delivered'},
    {cargoNo: '005', itemType: 'Utilities', weight: '33', status: 'Collected'}
];