import { Roles } from 'projects/tools/src/public-api';
import { MenuItem } from '../models/menu-item';
import { Routing } from '../routes/app-routes';

export const SIDEBAR_LIST: MenuItem[] = [
  {
    name: 'dashboard',
    icon: null,
    image: 'assets/images/icons/building.png',
    children: null,
    link: Routing.statics,
    role: [Roles.VirtualAdmin, Roles.SecuritCompany],
  },
  {
    name: 'reports',
    icon: null,
    image: 'assets/images/svg/reports.svg',
    children: null,
    link: Routing.reports.module,
    role: [Roles.VirtualAdmin, Roles.SecurityCompanyUser],
  },
  {
    name: 'branches',
    icon: null,
    image: 'assets/images/icons/building.png',
    children: null,
    link: Routing.branches.module,
    role: [Roles.VirtualAdmin],
  },
  {
    name: 'jobs',
    link: Routing.jobs.module,
    icon: null,
    image: 'assets/images/icons/jobs.png',
    children: null,
    role: [Roles.SecuritCompany, Roles.VirtualAdmin, Roles.SecurityCompanyUser],
  },
  {
    name: 'clients',
    link: Routing.clients.module,
    icon: '',
    image: 'assets/images/svg/clients.svg',
    children: null,
    role: [Roles.SecuritCompany, Roles.VirtualAdmin, Roles.SecurityCompanyUser],
  },
  {
    name: 'users',
    link: Routing.guards.module,
    icon: '',
    image: 'assets/images/svg/users.svg',
    children: null,
    role: [Roles.SecuritCompany, Roles.VirtualAdmin, Roles.SecurityCompanyUser],
  },
  {
    name: 'contracts',
    link: Routing.contracts.module,
    icon: '',
    image: 'assets/images/svg/contracts.svg',
    children: null,
    role: [Roles.SecuritCompany, Roles.VirtualAdmin],
  },
  {
    name: 'schedules_and_shifts',
    link: Routing.schedules.module,
    icon: '',
    image: 'assets/images/svg/shifts.svg',
    children: null,
    role: [Roles.SecuritCompany, Roles.VirtualAdmin, Roles.SecurityCompanyUser],
  },
  {
    name: 'settings',
    link: Routing.settings.module,
    icon: 'settings',
    image: null,
    role: [Roles.SecuritCompany, Roles.VirtualAdmin, Roles.SecurityCompanyUser],
    children: [
      {
        name: 'shifts',
        link: Routing.settings.children.shifts,
        icon: 'time',
        image: null,
        role: [
          Roles.SecuritCompany,
          Roles.VirtualAdmin,
          Roles.SecurityCompanyUser,
        ],
        children: null,
      },
    ],
  },
];
