import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, propTypes } from 'redux-form';
import Input from './render/Input';
import { required, password } from '../validators';
import { changePassword } from 'actions';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isFetching: false};
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.setState(() => ({isFetching: true}));
    this.props.dispatch(changePassword())
      .then(() => {
          this.setState(() => ({isFetching: false}));
          this.props.dispatch(this.props.reset(this.props.form));
        },
        (error_message) => this.setState(() => ({isFetching: false, error_message}))
      );
  }

  render() {
    let fields = [
      {
        name: 'password',
        type: 'password',
        label: 'Пароль',
        component: Input,
        validate: [required, password]
      },
      {
        name: 'new_password',
        type: 'password',
        label: 'Новий пароль',
        component: Input,
        validate: [required, password]
      }
    ];
    return(
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        {fields.map((field, i) => <Field {...field} key={i}/>)}
        {this.state.error_message && <div className="form-error">{this.state.error_message}</div>}
        {this.props.valid && <button type="submit" className="form-button">Зберегти</button>}
      </form>
    );
  }
}

ChangePassword.propTypes = {
  ...propTypes,
  dispatch: PropTypes.func
};

export default connect()(reduxForm({
  form: 'changePassword'
})(ChangePassword))
