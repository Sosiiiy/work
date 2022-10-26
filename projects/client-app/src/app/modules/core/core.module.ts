import {      NgModule    } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormsModule,
  NG_VALIDATORS,
  ReactiveFormsModule,
} from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgOtpInputModule } from 'ng-otp-input';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FeatureCardComponent } from '../../pages/home/components/feature-card/feature-card.component';

import { ToolsModule, UrlPipe } from 'projects/tools/src/public-api';
import { environment } from 'projects/client-app/src/environments/environment';
import { IonicModule } from '@ionic/angular';
import { AuthInterceptor } from '../auth/interceptors/auth.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IslamicDateComponent } from './components/islamic-date/islamic-date.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RoleDirective } from './directives/role.directive';
import { OrderCardComponent } from '../profile/components/client-profile/components/order-card/order-card.component';

const declarations = [
  FooterComponent,
  NavbarComponent,
  FeatureCardComponent,
  IslamicDateComponent,
  RoleDirective,
  OrderCardComponent,
];

const ref = [
  CommonModule,
  HttpClientModule,
  RouterModule,
  ToolsModule.forRoot(environment),
  ReactiveFormsModule,
  FormsModule,
  GoogleMapsModule,
  TranslateModule.forChild({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
    isolate: false,
  }),
  NgOtpInputModule,
  CarouselModule,
  BsDatepickerModule.forRoot(),
  IonicModule,
  NgbModule,
  NgxPaginationModule,
  Ng2SearchPipeModule,
];

@NgModule({
  declarations: [declarations],
      
  imports: [ref],
  exports: [declarations, ref],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
