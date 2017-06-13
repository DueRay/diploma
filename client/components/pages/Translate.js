import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, propTypes, change, reset } from 'redux-form';
import { required } from '../../validators';
import { translate } from 'actions';
import Radio from '../render/Radio';
import File from '../render/File';

class Translate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isFetching: false};
    this.onSubmit = this.onSubmit.bind(this);
    this.fileSave = this.fileSave.bind(this);
  }

  fileSave(e) {
    // if (['doc', 'txt'].includes(e.target.files[0].name.split('.').pop())) {
      let reader = new FileReader();
      reader.onloadend = function () {
        this.props.dispatch(change('translate', 'text', reader.result))
      }.bind(this);
      if (e.target.files[0]) {
        reader.readAsText(e.target.files[0])
      }

  }

  onSubmit() {
    this.setState(() => ({isFetching: true}));
    this.props.dispatch(translate())
      .then(() => {
          this.setState(() => ({isFetching: false}));
          this.props.dispatch(reset('translate'));
          this.props.history.push('/result');
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
            label: 'Перекласти все, окрім термінів'
          }, {
            value: 2,
            label: 'Перекласти тільки терміни'
          }
        ],
        component: Radio,
        validate: [required]
      },
      {
        name: 'text',
        label: 'Оберіть файл',
        component: File,
        validate: [required],
        fileSave: this.fileSave
      }
    ];
    return(
      <div>
        <div className="nav-second">
          <p className="nav-second-elem">Керівництво користувача</p>
          {this.props.result && <Link to="/result" className="nav-second-elem">Останній переклад</Link>}
        </div>
        <form className="clearfix" onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <div className="left-side">
            <div className="small-form">
              <Field {...fields[0]} />
              {this.state.error_message && <div className="form-error">{this.state.error_message}</div>}
            </div>
          </div>
          <div className="right-side">
            <Field {...fields[1]}/>
            <br/>
            {this.props.valid && <button className="small-button">Перекласти</button>}
          </div>
        </form>
      </div>
    );
  }
}

Translate.propTypes = {
  ...propTypes,
  history: PropTypes.object,
  result: PropTypes.string
};

export default connect((state) => ({
  initialValues: {...state.config, translation_type: `${state.config.translation_type}`},
  result: state.result
}))(reduxForm({
  form: 'translate'
})(Translate));
