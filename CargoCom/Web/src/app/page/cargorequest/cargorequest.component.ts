import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
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
    }

    update(element){
        this.cargoRequest = element;
    }

    async fetchRequestList(){
        let requestList: any = await this.http.get(
            `${this.service.ENDPOINT}/blockchain/user/${this.authService.admin.id}/api/org.airline.airChain.CargoRequest`,
            {withCredentials: true}
        ).toPromise();
        this.loadDataInTable(requestList)
    }

    loadDataInTable(requestList) {
        this.dataSource = new MatTableDataSource<any>(requestList);
        this.dataSource.paginator = this.paginator;
    }

}
