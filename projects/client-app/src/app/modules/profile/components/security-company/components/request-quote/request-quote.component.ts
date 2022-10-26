import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { arLocale, defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { AuthService } from 'projects/client-app/src/app/modules/auth/services/auth.service';
import { Routing } from 'projects/client-app/src/app/modules/core/routes/app-routes';
import { BehaviorSubject } from 'rxjs';
import {
  ClientCompany,
  convertDateToString,
  LangService,
  language,
  Lookup,
  ModalService,
  OptionSet,
  OptionSetItem,
  RequestsService,
  Roles,
} from 'projects/tools/src/public-api';

@Component({
  selector: 'app-request-quote',
  templateUrl: './request-quote.component.html',
  styleUrls: ['./request-quote.component.scss'],
})
export class RequestQuoteComponent implements OnInit {
  @Input('contractTypes') contractTypes!: any;
  @Input('shifts') shifts!: Lookup[];
  @Input('companyId') companyId!: number;
  requestForm!: FormGroup;
  allowed: boolean = true;
  login = `/${Routing.auth.module}/${Routing.auth.children.login}`;
  minDate!: Date;
  maxDate!: Date;
  minDate2!: Date;
  isAr: BehaviorSubject<boolean>;
  modalId = 'request-modal';

  constructor(
    private auth: AuthService,
    private fb: NonNullableFormBuilder,
    private lang: LangService,
    private localeService: BsLocaleService,
    private requests: RequestsService,
    private modal: ModalService
  ) {
    this.isAr = this.lang.isAr;

    this.generateForm();
    this.startDateListener();
  }

  public get controls() {
    return this.requestForm.controls as any;
  }

  ngOnInit() {
    this.initDatePiker();
    this.auth.userIdentity.subscribe((user) => {
      if (user && user.role == Roles.Company) {
        this.allowed = true;
      } else {
        this.allowed = false;
      }
    });
  }

  initDatePiker() {
    this.minDate = new Date();
    defineLocale('ar', arLocale);
    defineLocale('en', enGbLocale);
    this.lang.language.subscribe((res) => {
      res === language.ar
        ? this.localeService.use('ar')
        : this.localeService.use('en');
    });
  }

  generateForm() {
    this.requestForm = this.fb.group({
      email: [
        this.auth.snapshot.userInfo?.email,
        [Validators.required, Validators.email],
      ],
      location: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      latitude: [null, [Validators.required]],
      numberOfGurads: [null, [Validators.required, Validators.min(1)]],
      numberOfSupervisors: [null, [Validators.required, Validators.min(1)]],
      shiftTypeId: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      details: ['', [Validators.required]],
      contractTypeId: ['', [Validators.required]],
    });
  }

  startDateListener() {
    this.requestForm.get('startDate')?.valueChanges.subscribe((val: Date) => {
      this.minDate2 = new Date();
      this.minDate2.setDate(val.getDate() + 1);
    });
  }

  createRequest() {
    if (this.requestForm.invalid) return;

    let model = this.requestForm.value;
    model.clientCompanyId = (this.auth.snapshot.userInfo as ClientCompany).id;
    model.securityCompanyId = this.companyId;

    model.startDate = convertDateToString(model.startDate);
    model.endDate = convertDateToString(model.endDate);

    this.requests.add(model).subscribe(() => {
      this.modal.open(this.modalId);
    });
  }
}
