import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClientCompany, LangService, language, Roles } from 'projects/tools/src/public-api';

import { SecurityGuard } from '../../../auth/models/security-guard.model';
import { AuthService } from '../../../auth/services/auth.service';
import { ClientBranchUser } from '../../../client/models/client-branch-user';

import { Routing } from '../../routes/app-routes';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isScrolled!: boolean;
  display: boolean = false;
  links = {
    login: `${Routing.auth.module}/${Routing.auth.children.login}`,
    register: `${Routing.auth.module}/${Routing.auth.children.accountType}`,
    underConstriction: `${Routing.underConstruction}`,
    companies: `/${Routing.companies}`,
    guardProfile: `${Routing.profile.module}/${Routing.profile.children.guardProfile}`,
    clientProfile: `${Routing.profile.module}/${Routing.profile.children.clientProfile}`,
  };

  year = new Date().getFullYear();
  isLoggedIn!: boolean;
  langs = language;
  guard!: SecurityGuard;
  client!: ClientCompany;
  clientUser!: ClientBranchUser;
  state!: Subscription;

  constructor(private auth: AuthService, public lang: LangService) {}

  ngOnInit(): void {
    this.userStateListener();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    number > 71 ? (this.isScrolled = true) : (this.isScrolled = false);
  }

  onLanguageChangeListener() {
    let lang =
      this.lang.snapshot.lang == language.ar ? language.en : language.ar;
    this.lang.setCurrentLanguage(lang);
  }

  userStateListener() {
    this.state = this.auth.userInfo.subscribe((user) => {
      this.isLoggedIn = !!user;

      if (user) {
        let role = this.auth.snapshot.userIdentity?.role;
        if (role == Roles.Company) {
          this.client = user as ClientCompany;
        }

        if (role == Roles.SecurityGurd) {
          this.guard = user as SecurityGuard;
        }

        if (role == Roles.ClientCompanyUser) {
          this.clientUser = user as ClientBranchUser;
        }
      }
    });
  }

  logout() {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    this.state.unsubscribe();
  }
}
