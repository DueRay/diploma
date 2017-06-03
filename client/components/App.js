import { Route, Switch, BrowserRouter } from 'react-router-dom';
import React from 'react';
import { PrivateRoute } from './PrivateRoute';
import Home from './pages/Home';

export default class extends React.Component {
  render() {
    return <BrowserRouter>
      <div className="wrapper">
        <Switch>
          <Route path="/" exact component={Home}/>
          <PrivateRoute path="/profile" component={Home}/>
          <PrivateRoute path="/translate" component={Home}/>
          <Route path="/login" component={Home}/>
        </Switch>
      </div>
    </BrowserRouter>
  }
}
