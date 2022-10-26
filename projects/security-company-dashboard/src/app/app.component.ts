import { Component, enableProdMode } from '@angular/core';
import { LangService } from 'projects/tools/src/public-api';
import { AuthService } from './modules/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'security-company-dashboard';
  constructor(private lang: LangService, private auth: AuthService) {
    this.auth.autoLogin();
    this.lang.initLanguage();
  }
}
