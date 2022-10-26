import {      NgModule    } from '@angular/core';
import { SettingsRoutingModule } from './settings-routing.module';
import { ShiftsComponent } from './components/shifts/shifts.component';
import { CoreModule } from '../core/core.module';
import { ShiftCardComponent } from './components/shifts/components/shift-card/shift-card.component';

@NgModule({
  declarations: [ShiftsComponent, ShiftCardComponent],
      
  imports: [CoreModule, SettingsRoutingModule],
})
export class SettingsModule {}
