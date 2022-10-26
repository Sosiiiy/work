import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from 'projects/tools/src/public-api';
import { AuthService } from './modules/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'client-app';

  constructor(private lang: LangService, private auth: AuthService) {
    this.lang.initLanguage();
    this.auth.autoLogin();
  }
}
