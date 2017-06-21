import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, propTypes } from 'redux-form';
import Input from '../render/Input';
import { required } from '../../validators';
import { setProfile } from 'actions';
import moment from 'moment';
import ChangePassword from '../ChangePassword';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isFetching: false};
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.setState(() => ({isFetching: true}));
    this.props.dispatch(setProfile())
      .then(() => {
          this.setState(() => ({isFetching: false}));
        },
        (error_message) => this.setState(() => ({isFetching: false, error_message}))
      );
  }

  render() {
    if (this.state.isFetching) {
      return <div className="loader"/>;
    }
    let fields = [
      {
        name: 'username',
        type: 'text',
        label: 'Username',
        component: Input,
        validate: [required]
      }
    ];
    return(
      <div className="form">
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          {fields.map((field, i) => <Field {...field} key={i}/>)}
          <p>Зареєстрований : {moment(this.props.user.created_at).format('DD.MM.YYYY')}</p>
          {this.state.error_message && <div className="form-error">{this.state.error_message}</div>}
          {this.props.dirty && <button type="submit" className="form-button">Зберегти</button>}
        </form>
        <hr/>
        <ChangePassword/>
      </div>
    );
  }
}

Profile.propTypes = {
  ...propTypes,
  user: PropTypes.object,
  config: PropTypes.object
};

export default connect((state) => ({
  user: state.user,
  initialValues: state.user
}))(reduxForm({
  form: 'profile'
})(Profile));
