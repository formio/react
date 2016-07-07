'use strict';

var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var selectMixin = require('./mixins/selectMixin');
var formiojs = require('formiojs');

module.exports = React.createClass({
  displayName: 'Select',
  mixins: [valueMixin, selectMixin],
  componentWillMount: function componentWillMount() {
    switch (this.props.component.dataSrc) {
      case 'values':
        this.setState({
          selectItems: this.props.component.data.values
        });
        break;
      case 'json':
        try {
          this.setState({
            selectItems: JSON.parse(this.props.component.data.json)
          });
        } catch (error) {
          this.setState({
            selectItems: []
          });
        }
        break;
      case 'url':
        var url = this.props.component.data.url;
        if (url.substr(0, 1) === '/') {
          url = formiojs.baseUrl + url;
        }
        // Disable auth for outgoing requests.
        // TODO: Do we need this?
        //if (settings.data.url.indexOf(Formio.baseUrl) === -1) {
        //  options = {
        //    disableJWT: true,
        //    headers: {
        //      Authorization: undefined,
        //      Pragma: undefined,
        //      'Cache-Control': undefined
        //    }
        //  };
        //}
        formiojs.request(url).then(function (data) {
          this.setState({
            selectItems: data
          });
        }.bind(this));
        break;
      default:
        this.setState({
          selectItems: []
        });
    }
  }
});