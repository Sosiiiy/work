import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanySecurityGuard } from 'projects/security-company-dashboard/src/app/modules/client/models/site-details';
import { CryptoService, LangService } from 'projects/tools/src/public-api';

@Component({
  selector: 'app-guard-general-details',
  templateUrl: './guard-general-details.component.html',
  styleUrls: ['./guard-general-details.component.scss'],
})
export class GuardGeneralDetailsComponent implements OnInit {
  guard!: CompanySecurityGuard;
  constructor(
    private route: ActivatedRoute,
    private crypto: CryptoService,
    public lang: LangService
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe((params) => {
      let encryptedGuard = params['guard'];
      this.guard = JSON.parse(this.crypto.decrypt(encryptedGuard));
    });
  }
}
