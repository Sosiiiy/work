import { ClientBranchUsersResolver } from './components/client-branches-users/client-branch-users.resolver';
import { ClientBranchesUsersComponent } from './components/client-branches-users/client-branches-users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { ClientBranchesComponent } from './components/client-branches/client-branches.component';
import { ClientBranchesResolver } from './components/client-branches/client-branches.resolver';
import { ClientRoutes } from './routes/client-routes.enum';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';
import { BranchOrdersComponent } from './components/branch-orders/branch-orders.component';
import { WaitingOrdersComponent } from './components/waiting-orders/waiting-orders.component';
import { ManageOrdersComponent } from './components/manage-orders/manage-orders.component';
import { WaitingOrdersResolver } from './components/waiting-orders/waiting-orders.resolver';
import { BranchUsersResolver } from 'projects/security-company-dashboard/src/app/modules/branches/components/branch-users/branch-users.resolver';
import { BranchOrdersResolver } from './components/branch-orders/branch-orders.resolver';
import { AllOrdersResolver } from './components/all-orders/all-orders.resolver';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: ClientRoutes.branches,
        component: ClientBranchesComponent,
        resolve: {
          branches: ClientBranchesResolver,
        },
      },
      {
        path: ClientRoutes.branches + '/' + ClientRoutes.manageBranch + '/:id',
        component: ClientBranchesUsersComponent,
        resolve: {
          initData: ClientBranchUsersResolver,
        },
      },
      {
        path: ClientRoutes.orders,
        component: ManageOrdersComponent,
        children: [
          {
            path: ClientRoutes.allOrders,
            component: AllOrdersComponent,
            resolve: {
              orders: AllOrdersResolver,
            },
          },
          {
            path: ClientRoutes.branchOrders,
            component: BranchOrdersComponent,
            resolve: {
              orders: BranchOrdersResolver,
            },
          },
          {
            path: ClientRoutes.waitingOrders,
            component: WaitingOrdersComponent,
            resolve: {
              orders: WaitingOrdersResolver,
            },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
