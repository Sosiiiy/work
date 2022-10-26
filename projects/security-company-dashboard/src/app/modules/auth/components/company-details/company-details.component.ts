import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { arLocale, defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import {
  AcceptedFile,
  AcceptedImage,
  AttachmentService,
  convertDateToString,
  CountryCode,
  LangService,
  language,
  Lookup,
} from 'projects/tools/src/public-api';
import { Routing } from '../../../core/routes/app-routes';
import { FormProvider } from '../../models/form-provider';
import { CompanyRegisterForm, numberOfSteps } from '../register/form';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
})
export class CompanyDetailsComponent implements OnInit {
  step = CompanyRegisterForm.companyDetails;
  length = numberOfSteps();
  module = `/${Routing.auth.module}/${Routing.auth.children.register}`;

  finicalYears!: Lookup[];
  timeZone!: Lookup[];
  companyForm!: UntypedFormGroup;
  companyLogo: string | null = null;
  registerId: string | null = null;
  code = new UntypedFormControl(null, [Validators.required]);
  codes!: CountryCode[];
  isAr!: boolean;
  minDate!: Date;
  maxDate!: Date;
  docLink!: boolean;

  constructor(
    private formProvider: FormProvider,
    private route: ActivatedRoute,
    private router: Router,
    private lang: LangService,
    private localeService: BsLocaleService,
    private attachment: AttachmentService
  ) {
    this.initDatePiker();
    this.companyForm = this.formProvider
      .getForm()
      .get(this.step.key) as UntypedFormGroup;
    this.checkPrev();
  }

  get controls(): any {
    return this.companyForm.controls;
  }

  ngOnInit(): void {
    this.getInitData();
    this.mobileValidationListener();
    this.checkLang();
  }

  getInitData() {
    this.route.data.subscribe((res: any) => {
      this.finicalYears = [...res.initData.finYear];
      this.timeZone = [...res.initData.timeZone];
      this.codes = [...res.initData.codes];

      let defaultCountry = this.codes.find((element: CountryCode) => {
        return element.ioS2 === '+966';
      })!;

      this.code.setValue(defaultCountry.prefixCode);
      this.mobileValidationListener();
    });
  }

  mobileValidationListener() {
    this.code.valueChanges.subscribe((res) => {
      let code: CountryCode = this.codes.find(
        (e: CountryCode) => e.prefixCode == res
      )!;

      this.controls['companyContactNumber'].clearValidators();
      this.controls['companyContactNumber'].updateValueAndValidity();

      this.controls['companyContactNumber'].addValidators([
        Validators.pattern(code.regex),
        Validators.required,
      ]);
      this.controls['companyContactNumber'].updateValueAndValidity();
    });
  }

  initDatePiker() {
    this.maxDate = new Date();
    this.minDate = new Date(1960, 0, 1);
    defineLocale('ar', arLocale);
    defineLocale('en', enGbLocale);
    this.lang.language.subscribe((res) => {
      res === language.ar
        ? this.localeService.use('ar')
        : this.localeService.use('en');
    });
  }

  checkLang() {
    this.lang.language.subscribe((res) => {
      this.isAr = res === language.ar;
    });
  }

  checkPrev() {
    if (this.formProvider.getForm().get(this.step.prev)?.valid) {
      return;
    } else {
      let url = `${this.module}/${this.step.prev}`;
      this.router.navigate([url]);
    }
  }

  onImageLogoUpload(event: any) {
    let arr = event.target.files[0].name.split('.');
    const extension = arr[arr.length - 1].toLowerCase();

    if (!AcceptedImage.includes(extension)) {
      (this.controls['companyLogoId'] as UntypedFormControl).setErrors({
        notValid: true,
      });
      this.companyLogo = null;
      return;
    } else {
      let url = URL.createObjectURL(event.target.files[0]);
      (this.controls['companyLogoId'] as UntypedFormControl).setErrors({
        notValid: null,
      });
      this.companyLogo = url;
      this.attachment
        .uploadFile(event.target.files[0].name, event.target.files[0])
        .subscribe((res) => {
          this.controls['companyLogoId'].setValue(res);
        });
    }
  }

  onRegistrationId(event: any) {
    let arr = event.target.files[0].name.split('.');
    const extension = arr[arr.length - 1].toLowerCase();

    if (!AcceptedFile.includes(extension)) {
      (this.controls['commercialRegisterId'] as UntypedFormControl).setErrors({
        notValid: true,
      });
      this.registerId = null;
      return;
    } else {
      const files = ['pdf', 'doc', 'docx'];

      if (files.includes(extension)) {
        this.docLink = true;
      } else {
        let url = URL.createObjectURL(event.target.files[0]);
        this.registerId = url;
      }
      (this.controls['commercialRegisterId'] as UntypedFormControl).setErrors({
        notValid: null,
      });

      this.attachment
        .uploadFile(event.target.files[0].name, event.target.files[0])
        .subscribe((res) => {
          this.controls['commercialRegisterId'].setValue(res);
        });
    }
  }

  onSubmit() {
    if (this.companyForm.invalid) return;

    this.companyForm
      .get('companyStartDate')
      ?.patchValue(
        convertDateToString(this.companyForm.get('companyStartDate')?.value)
      );

    if (this.step.next) {
      let url = `${this.module}/${this.step.next}`;
      this.router.navigate([url]);
    }
  }
}
