
var React = require('react');
var Formio = require('./Formio');

var Demo = React.createClass({
  displayName: 'Demo',
  getInitialState: function() {
    return {
      src: '',
      inputSrc: ''
    }
  },
  setInputSrc: function(event) {
    this.setState({
      inputSrc: event.currentTarget.value
    });
  },
  setSrc: function() {
    console.log(this.state.inputSrc);
    this.setState({
      src: this.state.inputSrc
    });
  },
  resetSrc: function() {
    this.setState({
      src: ''
    });
  },
  render: function() {
    var formioForm = (this.state.src ? <Formio src={this.state.src}></Formio> : '');
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          Enter the form API url into the box below and press <strong>Show Form</strong> to view the form.
        </div>
        <div className="panel-body">
          <div className="form-group">
            <label htmlFor="form">Form API Url:</label>
            <input type="textfield" name="form" className="form-control" value={this.state.inputSrc} onChange={this.setInputSrc}/>
          </div>
          <div className="form-group">
            <a className="btn btn-primary" onClick={this.setSrc}>Show Form!</a>
          </div>
          {formioForm}
        </div>
        <div className="panel-footer">
          <a className="btn btn-primary" onClick={this.resetSrc}>Reset</a>
        </div>
      </div>
    );
  }
});
/*    form=""
 submission=""
 onFormSubmit=""
 onFormLoad=""
 onSubmissionLoad=""
 onElementRender=""
 onFormError=""*/

React.render(
  <Demo />
  , document.getElementById('formio')
);