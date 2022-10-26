import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'projects/tools/src/lib/validators/custom-validators.class';
import { Regex } from 'projects/tools/src/public-api';
import { FormProvider } from '../../models/form-provider';
import { CompanyRegisterForm, convertConfigurationsToArray } from './form';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [{ provide: FormProvider, useClass: RegisterComponent }],
})
export class RegisterComponent extends FormProvider implements OnInit {
  companyRegister!: UntypedFormGroup;
  FormConfig = convertConfigurationsToArray(CompanyRegisterForm);
  stepIndex: number = 1;

  constructor(private fb: UntypedFormBuilder, private route: ActivatedRoute) {
    super();
    this.generateForm();
  }

  ngOnInit(): void {
    this.onStepListener();
  }

  getForm(): UntypedFormGroup {
    return this.companyRegister;
  }

  onStepListener() {
    this.route.url.subscribe(() => {
      this.stepIndex = (this.route as any).snapshot.firstChild.data.order;
    });
  }

  generateForm() {
    let httpRegex =
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    let nameRegex = Regex.name;

    this.companyRegister = this.fb.group({
      'personal-details': this.fb.group({
        profileImageId: [null, Validators.required],
        firstName: [
          null,
          [
            Validators.required,
            CustomValidators.noSpace,
            Validators.pattern(nameRegex),
          ],
        ],
        lastName: [
          null,
          [
            Validators.required,
            CustomValidators.noSpace,
            Validators.pattern(nameRegex),
          ],
        ],
        email: [null, [Validators.required, Validators.email]],
        cityId: [null, Validators.required],
        areaId: [null, Validators.required],
        businessTypeId: [null, Validators.required],
        middleName: [
          null,
          [
            Validators.required,
            CustomValidators.noSpace,
            Validators.pattern(nameRegex),
          ],
        ],
      }),
      'company-details': this.fb.group({
        companyStartDate: [null, Validators.required],
        financeYearId: [null, Validators.required],
        name: [null, [Validators.required, CustomValidators.noSpace]],
        companyContactNumber: [null, [Validators.required]],
        timeZoneLookupId: [null, Validators.required],
        postalCode: [null, [Validators.required]],
        commercialRegisterId: [null, Validators.required],
        companyLogoId: [null, Validators.required],
      }),
      'other-details': this.fb.group({
        availableServicesIds: [null, Validators.required],
        website: [
          null,
          [
            Validators.required,
            CustomValidators.noSpace,
            Validators.pattern(httpRegex),
          ],
        ],
        socialMediaLink: [
          null,
          [
            Validators.required,
            CustomValidators.noSpace,
            Validators.pattern(httpRegex),
          ],
        ],
        socialMediaLink2: [null, [Validators.pattern(httpRegex)]],
        address: [null, [Validators.required, CustomValidators.noSpace]],
        businessDescription: [
          null,
          [Validators.required, CustomValidators.noSpace],
        ],
        companyScaleId: [null, Validators.required],
        locationLat: [null, Validators.required],
        locationLng: [null, Validators.required],
      }),
      'bank-details': this.fb.group({
        accountHolderName: [
          null,
          [Validators.required, CustomValidators.noSpace],
        ],
        bankName: [null, [Validators.required, CustomValidators.noSpace]],
        bankCode: [null, [CustomValidators.noSpace]],
        taxNumber: [
          null,
          [Validators.required, Validators.pattern(/^\d{15}$/)],
        ],
        bankBranch: [null, [CustomValidators.noSpace]],
        accountName: [null, [Validators.required, CustomValidators.noSpace]],
        iban: [
          null,
          [
            Validators.required,
            CustomValidators.noSpace,
            Validators.pattern(/^SA\d{4}[0-9A-Z]{18}$/),
          ],
        ],
        idProofId: [null, Validators.required],
      }),
    });
  }
}
