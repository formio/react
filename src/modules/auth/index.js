import * as constants from './constants';
import * as actions from './actions';
import * as reducers from './reducers';
import routes from './routes';
import selectors from './selectors';

export default class {
  constants = constants;
  actions = actions;
  reducers = reducers;

  constructor(config) {
    const defaultConfig = {
      storeKey: 'auth',
      path: 'auth',
      rootSelector: state => state,
      anonState: 'auth/login',
      authState: '',
      login: {
        form: 'user/login'
      },
      register: {
        form: 'user/register'
      }
    };
    this.config = Object.assign(defaultConfig, config);

    this.selectors = selectors(this.config);
    this.getRoutes = (allRoutes, anonRoutes, authRoutes) => routes(this.config, allRoutes, anonRoutes, authRoutes);
  }
}
