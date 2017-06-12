import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from 'actions';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="header">
        <div className="container clearfix">
          <NavLink to="/" className="home">Головна</NavLink>
          {this.props.authorized && <NavLink to="/" className="nav" onClick={() => {
            logout()
              .then(() => this.props.dispatch({type: 'RESET_USER'}))
          }}>Вийти</NavLink>}
          {this.props.authorized && <NavLink to="/profile" className="nav" activeClassName="nav_active">Профiль</NavLink>}
          {this.props.authorized && <NavLink to="/translate" className="nav" activeClassName="nav_active">Переклад</NavLink>}
          {!this.props.authorized && <NavLink to="/registration" className="nav" activeClassName="nav_active">Зареєструватись</NavLink>}
          {!this.props.authorized && <NavLink to="/login" className="nav" activeClassName="nav_active">Увійти</NavLink>}
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  authorized: PropTypes.bool,
  dispatch: PropTypes.func
};

export default connect((state) => ({
  authorized: state.authorized
}))(Header);
