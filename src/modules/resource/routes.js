import wrapper from './containers/Wrapper';
import resource from './containers/Resource';
import index from './containers/Index';
import create from './containers/Create';
import view from './containers/View';
import edit from './containers/Edit';
import deleteView from './containers/Delete';

export default (config, childRoutes = []) => [
  {
    path: config.name,
    component: config.Wrapper || wrapper(config),
    indexRoute: {
      component: config.Index || index(config)
    },
    childRoutes: [
      {
        path: 'new',
        component: config.Create || create(config)
      },
      {
        path: ':' + config.name + 'Id',
        component: config.Resource || resource(config),
        indexRoute: {
          component: config.View || view(config)
        },
        childRoutes: [
          {
            path: 'edit',
            component: config.Edit || edit(config)
          },
          {
            path: 'delete',
            component: config.Delete || deleteView(config)
          },
          ...childRoutes
        ]
      }
    ]
  }
];
