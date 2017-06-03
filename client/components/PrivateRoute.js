import React from 'react';
import {store} from 'stores';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={props => (
      store.getState().authorized ? (
        <Component {...props}/>
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
      )
    )}/>
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.any,
  location: PropTypes.object
};
