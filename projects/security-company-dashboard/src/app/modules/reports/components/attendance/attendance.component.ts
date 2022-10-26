import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { arLocale, defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from 'projects/security-company-dashboard/src/environments/environment';
import { map } from 'rxjs';
import {
  convertDateToString,
  LangService,
  language,
  PAGINATION_SIZES,
} from 'projects/tools/src/public-api';
import { AuthService } from '../../../auth/services/auth.service';
import { Loader } from '../../../core/enums/loader.enum';
import { AttendanceReport } from '../../models/attendance-report';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  private _hubConnection!: HubConnection;
  pageNumber = 1;
  pageSize = 10;
  total!: number;
  sizes = [...PAGINATION_SIZES];
  date = new FormControl();
  report!: AttendanceReport[];
  maxDate = new Date();
  yesterday!: Date;
searchKey = '';

  constructor(
    private reports: ReportsService,
    private auth: AuthService,
    public lang: LangService,
    private route: ActivatedRoute,
    private localeService: BsLocaleService
  ) {
    this.yesterday = new Date();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
    this.initDatePiker();
    this.connectHub();
  }

  ngOnInit(): void {
    this.onDateChange();
    this.route.data.subscribe((res) => {
      this.report = res['report'];
    });
  }

  onPageSizeChange(number: any) {
    this.pageSize = +number.target.value;
  }

  onPageNumberChange(event: number) {
    this.pageNumber = event;
  }

  initDatePiker() {
    defineLocale('ar', arLocale);
    defineLocale('en', enGbLocale);
    this.lang.language.subscribe((res) => {
      res === language.ar
        ? this.localeService.use('ar')
        : this.localeService.use('en');
    });
  }

  connectHub() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(environment.hub)
      .build();

    this._hubConnection
      .start()
      .then(() => {
        this._hubConnection.invoke(
          'AddToGroup',
          `${this.auth.snapshot.userInfo?.id}-attendance`
        );

        this._hubConnection.on('ReceiveMessage', (x, y) => {
          let date: any = this.date.value;
          let start = convertDateToString(date[0]);
          let end = convertDateToString(date[1]);
          this.getAttendance(start, end, Loader.no);
        });
      })
      .catch((err) =>
        console.log('error while establishing signalr connection')
      );
  }

  getAttendance(startDate: string, endDate: string, loader: Loader) {
    this.reports
      .getAttendanceReport(startDate, endDate, Loader.yes)
      .subscribe((res) => {
        this.report = res;
      });
  }

  onDateChange() {
    this.date.valueChanges
      .pipe(
        map((val: any) => ({
          start: convertDateToString(val[0]),
          end: convertDateToString(val[1]),
        }))
      )
      .subscribe((val) => {
        this.getAttendance(val.start, val.end, Loader.yes);
      });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._hubConnection.stop();
  }
}
