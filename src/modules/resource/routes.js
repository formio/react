import Resource from './containers/Resource';
import Index from './containers/Index';
import Create from './containers/Create';
import View from './containers/View';
import Edit from './containers/Edit';
import Delete from './containers/Delete';

export default (config, childRoutes = []) => [
  {
    path: config.name,
    component: config.Resource || Resource,
    indexRoute: {
      component: config.Index || Index(config)
    },
    childRoutes: [
      {
        path: 'new',
        component: config.Create || Create
      },
      {
        path: ':' + config.name + 'Id',
        indexRoute: config.View || View,
        childRoutes: [
          {
            path: 'view',
            component: config.View || View
          },
          {
            path: 'edit',
            component: config.Edit || Edit
          },
          {
            path: 'delete',
            component: config.Delete || Delete
          },
          ...childRoutes
        ]
      }
    ]
  }
];
