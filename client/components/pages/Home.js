import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="container">
        <div className="banner">
          <h1 className="greeting">Привіт, {this.props.authorized ? this.props.user.username : 'Незнайомець'}</h1>
          <p className="home-message">Це - веб-додаток для перекладу англомовної технічної документації</p>
          <Link to="/translate" className="home-button">Перейти до перекладу</Link>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
  authorized: state.authorized,
  user: state.user
}))(Home);
