import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveAs } from 'file-saver';

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  componentWillMount() {
    if (!this.props.result) {
      this.props.history.push('/')
    }
  }

  onClick() {
    let file = new File([this.result], 'result.doc');
    saveAs(file);
  }

  render() {
    return(
      <div className="result-container">
        <textarea defaultValue={this.props.result} className="textarea-result" ref={(e) => {
          if (e) {
            this.result = e.value;
          }
        }} onChange={(e) => this.result = e.target.value}/>
        <button className="small-button" onClick={this.onClick}>Зберігти</button>
      </div>
    );
  }
}

Result.propTypes = {
  history: PropTypes.object,
  result: PropTypes.string
};

export default connect((state) => ({
  result: state.result
}))(Result);
