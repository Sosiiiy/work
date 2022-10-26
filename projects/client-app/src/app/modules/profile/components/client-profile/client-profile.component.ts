import { ClientBranchUser } from './../../../client/models/client-branch-user';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'projects/tools/src/lib/validators/custom-validators.class';
import {
  AcceptedImage,
  AttachmentService,
  CanvasService,
  ClientCompany,
  ClientOrder,
  LangService,
  language,
  PAGINATION_SIZES,
  RequestsService,
  Roles,
} from 'projects/tools/src/public-api';
import { AuthService } from '../../../auth/services/auth.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss'],
})
export class ClientProfileComponent implements OnInit {
  user!: ClientCompany;
  orders!: ClientOrder[];
  pageNumber = 1;
  pageSize = 10;
  total!: number;
  sizes = PAGINATION_SIZES;
  canvasID = 'client';
  profileImage!: string | null;
  editClientForm!: FormGroup;
  isAr!: boolean;
  companyTypes!: any[];
  cities!: any[];

  constructor(
    private auth: AuthService,
    private requestService: RequestsService,
    private canvasServices: CanvasService,
    private fb: FormBuilder,
    private lang: LangService,
    private clientServices: ClientService,
    private attachment: AttachmentService,
    private route: ActivatedRoute
  ) {
    this.editClientForm = this.fb.group({
      name: [null, [Validators.required, CustomValidators.noSpace]],
      companyTypeId: [null, Validators.required],
      commercialRegistrationNumber: [
        null,
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      activityType: [null, [Validators.required, CustomValidators.noSpace]],
      email: [null, [Validators.required, Validators.email]],
      nationalAddress: [null, [Validators.required, CustomValidators.noSpace]],
      chargePerson: [null, [Validators.required, CustomValidators.noSpace]],
      chargePersonPhoneNumber: [null, Validators.required],
      cityId: [null, Validators.required],
      appUserId: [null, [Validators.required]],
      photoId: [null, [Validators.required]],
      id: [0],
    });

    this.checkLang();
  }

  get controls(): any {
    return this.editClientForm.controls;
  }

  get MobileNumber(): any {
    return this.editClientForm.get('chargePersonPhoneNumber');
  }

  ngOnInit() {
    this.getClient();
    this.getInitData();
  }

  getClient() {
    this.auth.userInfo.subscribe((user) => {
      if (this.auth.snapshot.userIdentity?.role == Roles.ClientCompanyUser) {
        this.user = (user as ClientBranchUser).clientCompany;
      } else {
        this.user = user as ClientCompany;
      }
    });
  }

  getInitData() {
    this.route.data.subscribe((res: any) => {
      this.cities = [...res.lookup.city];
      this.companyTypes = [...res.lookup.companyType];
    });
  }

  getOrders(id: number) {
    this.requestService.getAllByClientCompany(id).subscribe((response) => {
      this.orders = response;
    });
  }

  onPageSizeChange(number: any) {
    this.pageSize = +number.target.value;
  }

  checkLang() {
    this.lang.language.subscribe((res) => {
      this.isAr = res === language.ar;
    });
  }

  openCanvas(id: string) {
    this.canvasServices.open(id);
  }

  closeCanvas(id: string) {
    this.canvasServices.close(id);
  }

  editClient(guard: ClientCompany) {
    this.user = guard;
    this.editClientForm.patchValue(guard);
    this.openCanvas(this.canvasID);
  }

  onImageUpload(event: any) {
    let arr = event?.target?.files[0]?.name.split('.');
    const extension = arr[arr.length - 1].toLowerCase();

    if (!AcceptedImage.includes(extension)) {
      (this.controls['photoId'] as FormControl).setErrors({
        notValid: true,
      });
      this.profileImage = null;
      return;
    } else {
      let url = URL.createObjectURL(event.target.files[0]);
      (this.controls['photoId'] as FormControl).setErrors({
        notValid: null,
      });
      this.profileImage = url;
      this.attachment
        .uploadFile(event.target.files[0].name, event.target.files[0])
        .subscribe((res) => {
          this.controls['photoId'].setValue(res);
        });
    }
  }

  onSubmit() {
    if (this.editClientForm.invalid) return;
    let modal = this.editClientForm.value;
    this.clientServices.update(modal).subscribe((res) => {
      this.closeCanvas(this.canvasID);
      this.getClient();
      this.auth.getClientInfo();
    });
  }
}
