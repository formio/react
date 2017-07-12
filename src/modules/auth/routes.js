import Auth from './containers/Auth';
import Login from './containers/Login';
import Register from './containers/Register';
import ProtectAnon from './containers/ProtectAnon';
import ProtectAuth from './containers/ProtectAuth';

export default (config, allRoutes = [], anonRoutes = [], authRoutes = []) => [
  ...allRoutes,
  {
    component: ProtectAnon,
    childRoutes: [
      ...anonRoutes,
      {
        path: config.path,
        component: config.Auth || Auth,
        indexRoute: {
          component: Login
        },
        childRoutes: [
          {
            path: 'login',
            component: config.Login || Login
          },
          {
            path: 'register',
            component: config.Register || Register
          }
        ]
      }
    ]
  },
  {
    component: ProtectAuth,
    childRoutes: authRoutes
  }
];
