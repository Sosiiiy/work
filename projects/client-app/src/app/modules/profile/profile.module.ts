import {      NgModule    } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { SecurityCompanyComponent } from './components/security-company/security-company.component';
import { ClientProfileComponent } from './components/client-profile/client-profile.component';
import { CoreModule } from '../core/core.module';
import { GuardProfileComponent } from './components/guard-profile/guard-profile.component';
import { RequestQuoteComponent } from './components/security-company/components/request-quote/request-quote.component';
import { OrderCardComponent } from './components/client-profile/components/order-card/order-card.component';
import { UrlPipe } from 'projects/tools/src/public-api';

@NgModule({
  declarations: [
    SecurityCompanyComponent,
    ClientProfileComponent,
    GuardProfileComponent,
    RequestQuoteComponent,
    
  ],
  
      
  imports: [CoreModule, ProfileRoutingModule],
})
export class ProfileModule {}
