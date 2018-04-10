import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {BlockChainService} from "../../service/blockchain/block-chain.service";
import {AuthService} from "../../service/auth.service";
import {SettingService} from "../../service/setting/setting.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-flight',
  templateUrl: './cargorequest.component.html',
  styleUrls: ['./cargorequest.component.scss']
})
export class CargoRequestComponent implements OnInit {

  constructor(private http: HttpClient,
              private service: SettingService,
              public authService: AuthService,
              public blockChainService: BlockChainService) { }

  ngOnInit() {
  }

    displayedColumns = [ 'Owner', 'Departure', 'Destination','DeliveryDate', 'Option'];
    dataSource = new MatTableDataSource([]);

    cargoRequest:any;

    cargoInfo:any;

    flightList:any;

    isError = false;
    errorMessage: string;
    windowObj:any = window;

    availFlight = [
        {id:''},
        {flightNumber:''},
        {departureTime: new Date()}
    ];

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.fetchRequestList();
        this.fetchFlightList();
    }

    async update(element){
        this.cargoRequest = element;
        for(let flight of this.flightList){
            if(flight.orgin === this.cargoRequest.origin && flight.destination === this.cargoRequest.destinaction &&
                (flight.departureTime.getTime()>=this.cargoRequest.earlyDepartureTime.getTime() && flight.departureTime.getTime() <=this.cargoRequest.lateDepartureTime.getTime())){
                this.availFlight.push({id:flight.id}, {flightNumber: flight.flightNumber},{departureTime: flight.departureTime});
            }
        }
        this.cargoInfo = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Cargo/${this.cargoRequest.cargo}`,
            {withCredentials: true}
        ).toPromise();

    }

    async acceptRequest(){
        if(!this.cargoRequest.flight || this.cargoRequest.flight === ''){
            this.isError = true;
            this.errorMessage = 'You must assign a flight to the cargo item';
        }else {
            this.isError = true;
            await this.http.post(
                `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.AcceptCargoRequest`,
                {cargoRequest: this.cargoRequest.id, flight: this.cargoRequest.flight},
                {withCredentials: true})
                .toPromise();
            return this.windowObj.jQuery('.modal-backdrop').click();
        }

    }

    async fetchRequestList(){
        let requestList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CargoRequest`,
            {withCredentials: true}
        ).toPromise();
        this.loadDataInTable(requestList)
    }

    async fetchFlightList(){
         this.flightList = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.Flight`,
            {withCredentials: true}
        ).toPromise();
    }

    loadDataInTable(requestList) {
        this.dataSource = new MatTableDataSource<any>(requestList);
        this.dataSource.paginator = this.paginator;
    }

}
