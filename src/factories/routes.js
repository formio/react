import React from 'react';

let routes = [];

export function addRoute(route) {
  if (route) {
    routes.push(
      <div key={routes.length + 1}>
        {route}
      </div>
    );
  }
}

export const FormioRoutes = (props, context) => {
  return (
    <div>
      {routes}
    </div>
  );
};
