import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  HttpClient,
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { environment } from 'projects/security-company-dashboard/src/environments/environment';
import { convertDateToString, mapTheme, PAGINATION_SIZES } from 'projects/tools/src/public-api';
import { AuthService } from '../../../auth/services/auth.service';
import { AttendanceReport } from '../../../reports/models/attendance-report';
import { ReportsService } from '../../../reports/services/reports.service';
import { Loader } from '../../enums/loader.enum';
import { CompanyGuardsService } from '../../../guards/services/company-guards.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  mainLocation = new google.maps.LatLng({
    lat: 23.8859,
    lng: 45.0792,
  });
  style = mapTheme;
  private _hubConnection!: HubConnection;
  report!: AttendanceReport[];
  date = convertDateToString(new Date());
  yesterday!: Date;
  checkedIn: AttendanceReport[] = [];
  checkedOut: AttendanceReport[] = [];
  break: AttendanceReport[] = [];
  markers:{lat:any , lng:any}[] = [];
  guardsids: any[] = [];

  constructor(
    private auth: AuthService,
    private reports: ReportsService,
    private route: ActivatedRoute,
    private guard: CompanyGuardsService
  ) {
    this.connect();
    console.log("checked in guards"+this.checkedIn);

    guard.getAllGuardsOnCompany().subscribe((x) => {
      x.forEach(element => {
        this.guardsids.push(element.id);
        console.log("gggggggggggggggggggggggggggggggggggggggggg" + this.guardsids);
      });
      console.log( this.guardsids);
      this.guardsids.forEach(ele =>{
        
      guard.getGuardSites(ele).subscribe((y) =>{
        console.log("eeeeeeeeeee                "+ele);
          y.forEach(elet => {
            console.log("Lat :"+elet.locationLat);
            console.log("Log :"+elet.locationLong);
            
          });
          console.log("locations"+this.markers);
      });
      });

    });
      
      console.log( this.guardsids);
  }
    
  
  


  ngOnInit(): void {
    this.route.data.subscribe((res) => {
      let data = res['report'];
      this.report = data;
      this.report.forEach((x)=> {console.log("ssssssssss"+x.locationTracking[x.locationTracking.length-1].id);
    
      
    });
      console.log("report :"+this.report)
      this.checkedOut = data.filter((e: AttendanceReport) => e.isComplete);
      this.break = data.filter((e: AttendanceReport) => e.isOnBreak);
      this.checkedIn = data.filter((e: AttendanceReport) => !e.isComplete);
      console.log("checkedIn reporttttt :" +this.checkedIn[0]);
      this.checkedIn.forEach((x)=> {console.log("location tracking id           "+x.locationTracking[x.locationTracking.length-1].id)
      this.markers.push({"lat":x.locationTracking[x.locationTracking.length-1].lat,"lng":x.locationTracking[x.locationTracking.length-1].long});
    
                   });
      
    });

  }

  private connect(): void {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(environment.hub)
      .build();

    this._hubConnection
      .start()
      .then(() => {
        this._hubConnection
          .invoke('AddToGroup', `${this.auth.snapshot.userInfo?.id}-attendance`)
          .then(() => {
            this._hubConnection.on('ReceiveMessage', () => {
              this.getAttendance(this.date, this.date, Loader.no);
             
            });
          });
      })
      .catch((err) =>
        console.log('error while establishing signalr connection: ' + err)
      );
  }

  getAttendance(startDate: string, endDate: string, loader: Loader) {
    this.reports
      .getAttendanceReport(startDate, endDate, Loader.no)
      .subscribe((res) => {
        this.report = res;
        this.checkedOut = res.filter((e) => e.isComplete);
        this.break = res.filter((e) => e.isOnBreak);
        this.checkedIn = res.filter((e) => !e.isComplete);
       
      });
     
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._hubConnection.stop();
  }
}
