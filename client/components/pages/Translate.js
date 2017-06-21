import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, propTypes, change, reset } from 'redux-form';
import { required } from '../../validators';
import { translate } from 'actions';
import File from '../render/File';

class Translate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isFetching: false};
    this.onSubmit = this.onSubmit.bind(this);
    this.fileSave = this.fileSave.bind(this);
  }

  fileSave(e, name) {
    let format = e.target.files[0].name.split('.').pop();
    if (e.target.files[0]) {
      let reader = new FileReader();
      reader.onloadend = function () {
        if ((name === 'text' && ['doc', 'txt'].includes(format)) ||
          (name === 'dictionary' && ['json'].includes(format))) {
          this.setState(() => ({[`${name}_error`]: null}));
          this.props.dispatch(change('translate', name, reader.result));
        } else {
          this.setState(() => ({[`${name}_error`]: 'Недопустимий формат'}));
        }
      }.bind(this);
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
        name: 'text',
        label: 'Файл для перекладу:',
        component: File,
        validate: [required],
        fileSave: this.fileSave
      },
      {
        name: 'dictionary',
        label: 'Файл локалізації:',
        component: File,
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
              <Field {...fields[0]}/>
              {this.state.text_error && <p className="file-error">{this.state.text_error}</p>}
              <Field {...fields[1]}/>
              {this.state.dictionary_error && <p className="file-error">{this.state.dictionary_error}</p>}
              <br/>
              {this.props.valid && <button className="small-button">Перекласти</button>}
              {this.state.error_message && <div className="form-error">{this.state.error_message}</div>}
            </div>
          </div>
          <div className="right-side">
            <div className="translation-text">Файл для перекладу має бути формату .doc або .txt</div>
            <div className="translation-text">Файл локалазації має бути формату .json</div>
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
  result: state.result
}))(reduxForm({
  form: 'translate'
})(Translate));
