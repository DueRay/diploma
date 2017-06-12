import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes } from 'redux-form';
import { login } from 'actions';
import Input from '../render/Input';
import { required } from '../../validators';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isFetching: false};
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.setState(() => ({isFetching: true}));
    this.props.dispatch(login())
      .then(() => {
          this.setState(() => ({isFetching: false}));
          this.props.history.push('/');
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
      },
      {
        name: 'password',
        type: 'password',
        label: 'Пароль',
        component: Input,
        validate: [required]
      }
    ];
    return(
      <div>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)} className="form clearfix">
          {fields.map((field, i) => <Field {...field} key={i}/>)}
          {this.state.error_message && <div className="form-error">{this.state.error_message}</div>}
          <button type="submit" className="form-button">Увійти</button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  ...propTypes,
  history: PropTypes.object
};

export default reduxForm({
  form: 'login'
})(Login);
