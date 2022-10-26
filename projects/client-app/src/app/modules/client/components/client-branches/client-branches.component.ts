import { AuthService } from 'projects/client-app/src/app/modules/auth/services/auth.service';

import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AcceptedImage, CanvasService, LangService, ModalService } from 'projects/tools/src/public-api';
import { ClientBranch } from '../../models/client-branch';
import { CustomValidators } from 'projects/tools/src/lib/validators/custom-validators.class';
import { ClientBranchesService } from '../../services/client-branches.service';
import { Routing } from '../../../core/routes/app-routes';

@Component({
  selector: 'app-client-branches',
  templateUrl: './client-branches.component.html',
  styleUrls: ['./client-branches.component.scss'],
})
export class ClientBranchesComponent implements OnInit {
  @ViewChild('form') form!: FormGroupDirective;
  canvasId = 'clientCanvasID';
  imageExtension = [...AcceptedImage];
  branchForm!: FormGroup;
  branch: ClientBranch | null = null;
  branches: ClientBranch[] = [];
  isEdit: boolean = false;
  link: string | null = null;
  modalId = 'delete-client-branch-modal-id';
  manageLink = `/${Routing.profile.module}/${Routing.profile.children.clientProfile}/${Routing.client.module}/${Routing.client.children.branches}/${Routing.client.children.manageBranch}`;

  constructor(
    private fb: FormBuilder,
    public canvas: CanvasService,
    private route: ActivatedRoute,
    private branchService: ClientBranchesService,
    public lang: LangService,
    private auth: AuthService,
    private modal: ModalService
  ) {
    this.branchForm = fb.group({
      name: [null, [Validators.required, CustomValidators.noSpace]],
      nameEn: [null, [Validators.required, CustomValidators.noSpace]],
      overview: [null, [Validators.required, CustomValidators.noSpace]],
      overviewEn: [null, [Validators.required, CustomValidators.noSpace]],
      address: [null, [Validators.required]],
      locationLat: [null, [Validators.required]],
      locationLng: [null, [Validators.required]],
      photoId: [null, [Validators.required]],
      stauts: [false],
      isMainBranch: [false],
    });

    this.getInitData();

    console.log(this.manageLink);
  }

  public get controls(): any {
    return this.branchForm.controls;
  }

  ngOnInit() {}

  getInitData() {
    this.route.data.subscribe((res) => {
      this.branches = res['branches'];
    });
  }

  onAdd() {
    this.isEdit = false;
    this.form?.resetForm();
    this.canvas.open(this.canvasId);
  }

  onEdit(_branch: ClientBranch) {
    this.branch = _branch;
    this.isEdit = true;
    if (_branch.photo) {
      this.link = _branch.photo.fullLink;
    }
    this.form?.resetForm();
    this.branchForm.patchValue(this.branch);
    this.canvas.open(this.canvasId);
  }

  onDelete(_branch: ClientBranch) {
    this.branch = _branch;
    this.modal.open(this.modalId);
  }

  onSubmit() {
    if (this.branchForm.valid) {
      let model: ClientBranch = this.branchForm.value;
      model.clientCompanyId = this.auth.snapshot.userInfo?.id!;

      if (this.isEdit) {
        model.id = this.branch?.id!;
        this.edit(model);
      } else {
        this.add(model);
      }
    }
  }

  add(model: ClientBranch) {
    this.branchService.addBranch(model).subscribe(() => {
      this.canvas.close(this.canvasId);
      this.getBranches();
      this.form.resetForm();
    });
  }

  edit(model: ClientBranch) {
    this.branchService.updateBranch(model).subscribe(() => {
      this.canvas.close(this.canvasId);
      this.getBranches();
      this.form.resetForm();
    });
  }

  delete(_branch: ClientBranch) {
    this.branchService
      .deleteBranch(_branch.id)
      .subscribe(() => this.getBranches());
  }

  getBranches() {
    this.branchService.getAllBranches().subscribe((response) => {
      this.branches = response;
    });
  }
}
