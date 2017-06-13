import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, propTypes } from 'redux-form';
import Radio from '../render/Radio';
import { required } from '../../validators';
import { setConfig, getConfig } from 'actions';
import moment from 'moment';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isFetching: false};
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.setState(() => ({isFetching: true}));
    this.props.dispatch(setConfig())
      .then(() => {
          this.setState(() => ({isFetching: false}));
          return this.props.dispatch(getConfig());
        },
        (error) => this.setState(() => ({isFetching: false, error_message: error.response.data.message}))
      );
  }

  render() {
    if (this.state.isFetching) {
      return <div className="loader"/>;
    }
    let fields = [
      {
        name: 'translation_type',
        label: 'Тип перекладу',
        options: [
          {
            value: 0,
            label: 'Перекласти все'
          }, {
            value: 1,
            label: 'Перекласти все, окрім слів'
          }, {
            value: 2,
            label: 'Перекласти тільки терміни'
          }
        ],
        component: Radio,
        validate: [required]
      }
    ];
    return(
      <form className="form" onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <p>username : {this.props.user.username}</p>
        <p>Зареєстрований : {moment(this.props.user.created_at).format('DD.MM.YYYY')}</p>
        {fields.map((field, i) => <Field {...field} key={i}/>)}
        {this.state.error_message && <div className="form-error">{this.state.error_message}</div>}
        {this.props.dirty && <button type="submit" className="form-button">Зберегти</button>}
      </form>
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
  initialValues: state.config
}))(reduxForm({
  form: 'config'
})(Profile));
