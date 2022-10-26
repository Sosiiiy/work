import { AuthRoutes } from '../../auth/routes/auth-routes.enum';
import { ClientRoutes } from '../../client/routes/client-routes.enum';
import { ProfileRoutes } from '../../profile/routes/profile-routes.enum';

export const Routing = {
  auth: {
    module: 'auth',
    children: AuthRoutes,
  },
  profile: {
    module: 'profile',
    children: ProfileRoutes,
  },
  client: {
    module: 'client-control',
    children: ClientRoutes,
  },
  settings: 'settings',
  home: 'home',
  unauthorized: '401',
  notFound: '404',
  forbidden: '403',
  underConstruction: 'under-construction',
  companies: 'companies',
};
