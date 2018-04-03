import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {BlockChainService} from "../../service/blockchain/block-chain.service";
import {AuthService} from "../../service/auth.service";
import {HttpClient} from "@angular/common/http";
import {SettingService} from "../../service/setting/setting.service";

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  constructor(private http: HttpClient,
              private service: SettingService,
              public authService: AuthService,
              public blockChainService: BlockChainService) { }

  ngOnInit() {
  }
    displayedColumns = ['id', 'Type', 'Description', 'Status', 'Flight', 'Option'];
    dataSource = new MatTableDataSource([]);
    serviceInfo: any = {
        type: '',
        id: '',
        description: '',
        status: '',
        staff: '',
        flight: {},
        flightList: ''
    };


    flight:any;

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.fetchServiceList();
    }



    update(element) {
        this.serviceInfo = element;
    }

    async viewFlight(flight){
        this.flight = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight/${flight}`,
            {withCredentials: true}
        ).toPromise();
        //Remove Cabin Crew NameSpace
        if(flight.cabinCrews) {
            flight.cabinCrews = flight.cabinCrew.replace(this.blockChainService.AIRLINE_EMPLOYEE, "");
        }

    }
    async fetchServiceList() {
        let serviceList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Service`,
            {withCredentials: true}
        ).toPromise();


        console.log(serviceList);

        this.loadDataInTable(serviceList);
    }

    loadDataInTable(serviceList) {
        this.dataSource = new MatTableDataSource<any>(serviceList);
        this.dataSource.paginator = this.paginator;
    }


}


