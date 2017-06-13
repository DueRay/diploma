import { Route, Switch, BrowserRouter } from 'react-router-dom';
import React from 'react';
import { PrivateRoute } from './PrivateRoute';
import Header from './Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Profile from './pages/Profile';

export default class extends React.Component {
  render() {
    return(
    <BrowserRouter>
      <div>
        <Route component={Header}/>
        <Switch>
          <Route path="/" exact component={Home}/>
          <PrivateRoute path="/profile" component={Profile}/>
          <PrivateRoute path="/translate" component={Home}/>
          <Route path="/login" component={Login}/>
          <Route path="/registration" component={Registration}/>
        </Switch>
      </div>
    </BrowserRouter>);
  }
}
