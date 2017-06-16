import Auth from './containers/Auth';
import Login from './containers/Login';
import Register from './containers/Register';
import ProtectAnon from './containers/ProtectAnon';
import ProtectAuth from './containers/ProtectAuth';

export default (config, store, allRoutes = [], anonRoutes = [], authRoutes = []) => [
  ...allRoutes,
  {
    component: ProtectAnon,
    childRoutes: [
      ...anonRoutes,
      {
        path: config.path,
        component: Auth,
        indexRoute: {
          component: Login
        },
        childRoutes: [
          {
            path: 'login',
            component: Login
          },
          {
            path: 'register',
            component: Register
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