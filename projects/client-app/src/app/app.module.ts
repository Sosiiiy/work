import { HttpClient } from '@angular/common/http';
import { NgModule,      NO_ERRORS_SCHEMA} from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule, HttpLoaderFactory } from './modules/core/core.module';
import { ApplyFormComponent } from './pages/home/components/apply-form/apply-form.component';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileModule } from './modules/profile/profile.module';
import { CompaniesComponent } from './pages/companies/companies.component';
import { CompanyCardComponent } from './pages/companies/components/company-card/company-card.component';
import { IonicModule } from '@ionic/angular';
import { UrlPipe } from 'projects/tools/src/public-api';
import { OrderCardComponent } from './modules/profile/components/client-profile/components/order-card/order-card.component';

const declarations = [
  AppComponent,
  HomeComponent,
  LayoutComponent,
  ApplyFormComponent,
  CompaniesComponent,
  CompanyCardComponent,
];

@NgModule({
  declarations: [declarations],
      
  imports: [
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ProfileModule,
    IonicModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
