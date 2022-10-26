import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AcceptedFile,
  AttachmentService,
  CountryCode,
  LangService,
  language,
  Lookup,
  LookupService,
} from 'projects/tools/src/public-api';
import { Routing } from '../../../core/routes/app-routes';
import { FormProvider } from '../../models/form-provider';
import { CompanyRegisterForm, numberOfSteps } from '../register/form';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
})
export class PersonalDetailsComponent implements OnInit {
  step = CompanyRegisterForm.personalDetails;
  length = numberOfSteps();
  module = `/${Routing.auth.module}/${Routing.auth.children.register}`;
  code = new UntypedFormControl(null, [Validators.required]);
  codes!: CountryCode[];
  cities!: Lookup[];
  areas!: Lookup[];
  businessTypes!: Lookup[];
  personalForm!: UntypedFormGroup;
  profileImage!: string | null;
  isAr!: boolean;

  get controls(): any {
    return this.personalForm?.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private fromProvider: FormProvider,
    private router: Router,
    private lookup: LookupService,
    private lang: LangService,
    private attachment: AttachmentService
  ) {
    this.personalForm = this.fromProvider
      .getForm()
      .get(this.step.key) as UntypedFormGroup;
  }

  ngOnInit(): void {
    this.getInitData();
    this.checkLang();
    this.mobileValidationListener();
  }

  getInitData() {
    this.route.data.subscribe((res: any) => {
      let data = res;

      this.codes = [...data.initData.codes];
      this.cities = [...data.initData.cities];
      this.businessTypes = [...data.initData.businessTypes];

      let defaultCountry = this.codes.find((element: CountryCode) => {
        return element.ioS2 === '+966';
      })!;
      this.code.setValue(defaultCountry.prefixCode);
    });
  }

  checkLang() {
    this.lang.language.subscribe((res) => {
      this.isAr = res === language.ar;
    });
  }

  mobileValidationListener() {
    this.code.valueChanges.subscribe((res) => {
      let code: CountryCode = this.codes.find(
        (e: CountryCode) => e.prefixCode == res
      )!;

      this.controls['mobileNumber'].clearValidators();
      this.controls['mobileNumber'].updateValueAndValidity();

      this.controls['mobileNumber'].addValidators([
        Validators.pattern(code.regex),
        Validators.required,
      ]);
      this.controls['mobileNumber'].updateValueAndValidity();
    });
  }

  onImageUpload(event: any) {
    let arr = event.target.files[0].name.split('.');
    const extension = arr[arr.length - 1].toLowerCase();

    if (!AcceptedFile.includes(extension)) {
      (this.controls['profileImageId'] as UntypedFormControl).setErrors({
        notValid: true,
      });
      this.profileImage = null;
      return;
    } else {
      let url = URL.createObjectURL(event.target.files[0]);
      (this.controls['profileImageId'] as UntypedFormControl).setErrors({
        notValid: null,
      });
      this.profileImage = url;
      this.attachment
        .uploadFile(event.target.files[0].name, event.target.files[0])
        .subscribe((res) => {
          this.controls['profileImageId'].setValue(res);
        });
    }
  }

  citySelectListener(event: any) {
    this.lookup.getAreas(event).subscribe((res) => {
      this.areas = [...res];
    });
  }

  onSubmit() {
    if (this.personalForm.invalid) return;
    if (this.step.next) {
      let url = `${this.module}/${this.step.next}`;
      this.router.navigate([url]);
    }
  }
}
