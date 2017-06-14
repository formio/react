import Auth from './containers/Auth';
import Login from './containers/Login';
import Register from './containers/Register';
import ProtectAnon from './containers/ProtectAnon';
import ProtectAuth from './containers/ProtectAuth';

export default function(config) {
  return (anonRoutes = [], authRoutes = []) => [
    ...anonRoutes,
    {
      component: ProtectAnon,
      childRoutes: [
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
  ]
}