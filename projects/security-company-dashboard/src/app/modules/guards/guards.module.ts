import {      NgModule    } from '@angular/core';
import { CoreModule } from '../core/core.module';

import { GuardsRoutingModule } from './guards-routing.module';
import { GuardsComponent } from './guards.component';
import { GuardsListComponent } from './components/guards-list/guards-list.component';
import { SupervisorsListComponent } from './components/supervisors-list/supervisors-list.component';
import { GuardsDetailsComponent } from './components/guards-details/guards-details.component';
import { GuardGeneralDetailsComponent } from './components/guards-details/components/guard-general-details/guard-general-details.component';
import { GuardSiteComponent } from './components/guards-details/components/guard-site/guard-site.component';
import { GuardLeavesComponent } from './components/guards-details/components/guard-leaves/guard-leaves.component';
import { GuardSiteCardComponent } from './components/guards-details/components/guard-site/components/guard-site-card/guard-site-card.component';

@NgModule({
  declarations: [
    GuardsComponent,
    GuardsListComponent,
    SupervisorsListComponent,
    GuardsDetailsComponent,
    GuardGeneralDetailsComponent,
    GuardSiteComponent,
    GuardLeavesComponent,
    GuardSiteCardComponent,
  ],
  imports: [CoreModule, GuardsRoutingModule],
      
})
export class GuardsModule {}
