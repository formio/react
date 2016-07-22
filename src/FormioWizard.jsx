var React = require('react');
var FormioComponents = require('./FormioComponents');

module.exports = React.createClass({
  displayName: 'FormioWizard',
  getInitialState: function() {
    var pages = [];
    var numPages = 0;
    this.props.components.forEach(function(component, index) {
      if (component.type === 'panel') {
        pages.push(component);
        numPages++;
      }
    });
    return {
      currentPage: 0,
      pages: pages,
      numPages: numPages
    };
  },
  nextPage: function(event) {
    console.log('click');
    event.preventDefault();
    this.setState(function(previousState) {
      if (previousState.currentPage < (numPages - 1)) {
        previousState.currentPage++;
      }
      return previousState;
    });
  },
  previousPage: function() {
    this.setState((previousState) => {
      if (previousState.currentPage > 0) {
        previousState.currentPage--;
      }
      return previousState;
    });
  },
  render: function () {
    var pages = this.state.pages;
    var pageArray = [];

    for(var i = 0; i < pages.length;i++){
      var blueButton =
        <a className="bs-wizard-dot bg-primary">
          <div className="bs-wizard-dot-inner bg-success"></div>
        </a>;

      pageArray.push(
        <div className="bs-wizard-step">
          <div className="text-center bs-wizard-stepnum">
            {pages[i].title}
          </div>
          <div className="progress">
            <div className="progress-bar progress-bar-primary"></div>
          </div>
        </div>
      )
    }

    // Add class active to current page section
    if(pages[this.state.currentPage]){
      console.log('test');
    }

    return (
      <div className="formio-wizard">
          <div className="panel-body">
            <div className="panel-heading">
              <h3 className="panel-title">Preview</h3>
            </div>
            <div className="row bs-wizard hasTitles">
              {pageArray}
            </div>
            <FormioComponents
              {...this.props}
              components = {this.state.pages[this.state.currentPage].components}
            >
            </FormioComponents>
            <button
              onClick={this.nextPage}
              type="button"
            >Next</button>
          </div>
      </div>
    );
  }
});
