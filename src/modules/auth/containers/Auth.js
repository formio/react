import React from 'react';
import {Link} from 'react-router';

export default function Auth(props) {
  return (
  <div className="row">
    <div className="col-md-4 col-md-offset-4">
      <div className="panel panel-default">
        <div className="panel-heading" style={{paddingBottom: 0, borderBottom: 'none'}}>
          <ul className="nav nav-tabs" style={{borderBottom: 'none'}}>
            <li role="presentation"><Link to="/auth/login">Login</Link></li>
            <li role="presentation"><Link to="/auth/register">Register</Link></li>
          </ul>
        </div>
        <div className="panel-body">
          <div className="row">
            <div className="col-lg-12">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
