import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftsComponent } from './components/shifts/shifts.component';
import { ShiftsResolver } from './components/shifts/shifts.resolver';
import { SettingsRoutes } from './routes/settings-routes.enum';

const routes: Routes = [
  {
    path: SettingsRoutes.shifts,
    component: ShiftsComponent,
    resolve: {
      initData: ShiftsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
