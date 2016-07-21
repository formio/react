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
    for(var i = 0; i < pages.length;i++){
      console.log(pages[i]);
    }
    //debugger;

    return (
      <div className="formio-wizard">
        <div className="row bs-wizard hasTitles">
          <div className="col-sm-2 bs-wizard-step active">
            <div className="text-center bs-wizard-stepnum">
              {this.state.pages[this.state.currentPage].title}
            </div>
          </div>
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
    );
  }
});
