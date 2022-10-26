import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Lookup } from 'projects/tools/src/lib/models/lookup';
import { LangService } from 'projects/tools/src/lib/services/lang.service';
import { LookupService } from 'projects/tools/src/lib/services/lookups.service';

import { CustomValidators } from 'projects/tools/src/lib/validators/custom-validators.class';
import { combineLatest, map } from 'rxjs';
import { language, Regex } from 'projects/tools/src/public-api';
import { SecurityGuard } from '../../models/security-guard.model';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('successModal') modal!: ElementRef<HTMLButtonElement>;

  bloodTypes!: Lookup[];
  genders!: Lookup[];
  cities!: Lookup[];
  jobTypes!: Lookup[];
  nationalities!: Lookup[];
  registerForm!: FormGroup;
  registerType!: string;
  isAr!: boolean;
  date!: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private lookup: LookupService,
    private auth: AuthService,
    private lang: LangService
  ) {
    this.generateForm();
    this.checkLang();
  }

  ngOnInit() {
    this.getInitData();
  }

  get controls(): any {
    return this.registerForm.controls;
  }

  public get BirthDate(): FormControl {
    return this.registerForm.get('birthDate') as FormControl;
  }

  loadCities(id: any) {
    this.lookup.getCity(id).subscribe((res) => {
      this.cities = res;
    });
  }

  checkLang() {
    this.lang.language.subscribe((res) => {
      this.isAr = res === language.ar;
    });
  }

  getInitData() {
    combineLatest([this.route.data, this.route.params])
      .pipe(map((res) => ({ data: res[0], params: res[1] })))
      .subscribe((response: { data: any; params: any }) => {
        let data = response.data.lookup;
        this.bloodTypes = [...data.bloodType];
        this.genders = [...data.gender];

        this.jobTypes = [...data.jobType];
        this.nationalities = [...data.nationality];
        this.registerType = response.params['type'];
      });
  }

  generateForm() {
    this.registerForm = this.fb.group({
      firstName: [
        null,
        [
          Validators.required,
          CustomValidators.noSpace,
          Validators.pattern(Regex.name),
        ],
      ],
      middleName: [
        null,
        [
          Validators.required,
          CustomValidators.noSpace,
          Validators.pattern(Regex.name),
        ],
      ],
      lastName: [
        null,
        [
          Validators.required,
          CustomValidators.noSpace,
          Validators.pattern(Regex.name),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      nationalID: [
        null,
        [Validators.required, Validators.pattern('[1-2][\\d]{9}')],
      ],
      bloodTypeId: [null, [Validators.required]],
      genderId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      jobTypeId: [null, [Validators.required]],
      nationalityId: [null, [Validators.required]],
      birthDate: [null, [Validators.required]],
      terms: [null, Validators.requiredTrue],
    });
  }

  convertDateToString(date: any) {
    return new Date(date)
      .toLocaleString('en-GB', {
        day: 'numeric',
        year: 'numeric',
        month: 'numeric',
      })
      .replace('/', '-')
      .replace('/', '-');
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    let model: SecurityGuard = this.registerForm.value;

    this.auth.registerSecurityGuard(model).subscribe((response) => {
      this.auth.getGuardInfo();
      this.modal.nativeElement.click();
    });
  }
}
