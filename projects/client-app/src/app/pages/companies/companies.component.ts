import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecurityCompany } from 'projects/tools/src/lib/models/security-company';
import { PAGINATION_SIZES } from 'projects/tools/src/public-api';
import { CanvasService, LangService, Lookup, Pagination } from 'projects/tools/src/public-api';
import { CompaniesService } from './companies.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit {
  companies!: Pagination<SecurityCompany>;
  pageNumber = 1;
  pageSize = 10;
  total!: number;
  sizes = PAGINATION_SIZES;
  services!: Lookup[];
  searchKey = '';

  constructor(
    public canvas: CanvasService,
    private activeRoute: ActivatedRoute,
    private companiesService: CompaniesService,
    public lang: LangService
  ) {}

  ngOnInit() {
    this.getInitData();
  }

  onPageSizeChange(number: any) {
    this.pageSize = +number.target.value;
    this.getCompanies();
  }

  onPageNumberChange(event: number) {
    this.pageNumber = event;
    this.getCompanies();
  }

  getInitData() {
    this.activeRoute.data.subscribe((res) => {
      this.companies = res['companies'];
      this.getAllServices(this.companies.data);
    });
  }

  getCompanies() {
    this.companiesService
      .getApprovedCompanies(this.pageNumber, this.pageSize)
      .subscribe((res) => {
        (this.companies = res), (this.total = res.totalCount);
      });
  }

  getAllServices(companies: SecurityCompany[]) {
    let services: any[] = [];
    companies.forEach((e) => {
      let arr = e.securitCompanyAvailableServices.map(
        (a) => a.availableServices
      );
      services = services.concat(arr);
    });

    this.services = [...new Map(services.map((m) => [m.id, m])).values()];
  }
}
