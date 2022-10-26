import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ForbiddenComponent,
  NotFoundComponent,
  UnauthorizedComponent,
  UnderConstructionComponent,
} from 'projects/tools/src/public-api';
import { SecurityCompaniesResolver } from './modules/core/resolvers/security-companies.resolver';
import { Routing } from './modules/core/routes/app-routes';
import { CompaniesComponent } from './pages/companies/companies.component';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './pages/layout/layout.component';

const routes: Routes = [
  /* ------------------------------- main layout ------------------------------ */
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: Routing.home,
        pathMatch: 'full',
      },
      {
        path: Routing.home,
        component: HomeComponent,
        resolve: {
          companies: SecurityCompaniesResolver,
        },
      },
      {
        path: Routing.companies,
        component: CompaniesComponent,
        resolve: {
          companies: SecurityCompaniesResolver,
        },
      },
      {
        path: Routing.profile.module,
        loadChildren: () =>
          import('./modules/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
    ],
  },
  {
    path: Routing.auth.module,
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  /* ------------------------------ static pages ------------------------------ */
  {
    path: Routing.unauthorized,
    component: UnauthorizedComponent,
  },
  {
    path: Routing.underConstruction,
    component: UnderConstructionComponent,
  },
  {
    path: Routing.notFound,
    component: NotFoundComponent,
  },
  {
    path: Routing.forbidden,
    component: ForbiddenComponent,
  },

  /* -------------------------------- wild card ------------------------------- */
  {
    path: '**',
    redirectTo: Routing.notFound,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollPositionRestoration: 'enabled',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
