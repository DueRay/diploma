import React from 'react';
import { reduxForm, Field, propTypes } from 'redux-form';
import { register } from 'actions';
import Input from '../render/Input';
import { required, password } from '../../validators';

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isFetching: false};
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.setState(() => ({isFetching: true}));
    this.props.dispatch(register())
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
        validate: [required, password]
      }
    ];
    return(
      <div>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)} className="form clearfix">
          {fields.map((field, i) => <Field {...field} key={i}/>)}
          {this.state.error_message && <div className="form-error">{this.state.error_message}</div>}
          <button type="submit" className="form-button">Зареєструвати</button>
        </form>
      </div>
    );
  }
}

Registration.propTypes = {
  ...propTypes
};

export default reduxForm({
  form: 'registration'
})(Registration);
