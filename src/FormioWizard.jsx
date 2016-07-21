var React = require('react');
var FormioComponents = require('./FormioComponents');

module.exports = React.createClass({
  displayName: 'FormioWizard',
  getInitialState: function() {
    let pages = [];
    let numPages = 0;
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
    event.preventDefault();
    console.log('click');
    this.setState((previousState) => {
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
    })
  },
  render: function () {
    return (
      <div className="formio-wizard">
        <FormioComponents
          {...this.props}
          components = {this.state.pages[this.state.currentPage].components}
        >
        </FormioComponents>
        <button
          type="button"
          onClick={this.nextPage}
        >Next</button>
      </div>
    );
  }
});
