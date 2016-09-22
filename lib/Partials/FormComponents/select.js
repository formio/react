'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _selectMixin = require('./mixins/selectMixin');

var _selectMixin2 = _interopRequireDefault(_selectMixin);

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

var _util = require('../../util');

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  options: {},
  lastInput: '',
  displayName: 'Select',
  mixins: [_valueMixin2.default, _selectMixin2.default],
  componentWillMount: function componentWillMount() {
    switch (this.props.component.dataSrc) {
      case 'values':
        this.internalFilter = true;
        this.setState({
          selectItems: this.props.component.data.values
        });
        break;
      case 'json':
        this.internalFilter = true;
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
      case 'resource':
      case 'url':
        if (this.props.component.dataSrc === 'url') {
          this.url = this.props.component.data.url;
          if (this.url.substr(0, 1) === '/') {
            this.url = _formiojs2.default.getBaseUrl() + this.props.component.data.url;
          }

          // Disable auth for outgoing requests.
          if (!this.props.component.authenticate && this.url.indexOf(_formiojs2.default.getBaseUrl()) === -1) {
            this.options = {
              disableJWT: true,
              headers: {
                Authorization: undefined,
                Pragma: undefined,
                'Cache-Control': undefined
              }
            };
          }
        } else {
          this.url = _formiojs2.default.getBaseUrl();
          if (this.props.component.data.project) {
            this.url += '/project/' + this.props.component.data.project;
          }
          this.url += '/form/' + this.props.component.data.resource + '/submission';
        }

        this.options.params = {
          limit: 100,
          skip: 0
        };

        this.refreshItems();

        break;
      default:
        this.setState({
          selectItems: []
        });
    }
  },
  refreshItems: function refreshItems(input, newUrl, append) {
    var data = Object.assign({}, this.props.data, this.props.subData);
    newUrl = newUrl || this.url;
    // Allow templating the url.
    newUrl = (0, _util.interpolate)(newUrl, {
      data: data,
      formioBase: _formiojs2.default.getBaseUrl()
    });
    if (!newUrl) {
      return;
    }

    // If this is a search, then add that to the filter.
    if (this.props.component.searchField && input) {
      // If they typed in a search, reset skip.
      if (this.lastInput !== input) {
        this.lastInput = input;
        this.options.params.skip = 0;
      }
      newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + encodeURIComponent(this.props.component.searchField) + '=' + encodeURIComponent(input);
    }

    // Add the other filter.
    if (this.props.component.filter) {
      var filter = (0, _util.interpolate)(this.props.component.filter, { data: data });
      newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + filter;
    }

    // If they wish to return only some fields.
    if (this.props.component.selectFields) {
      this.options.params.select = this.props.component.selectFields;
    }

    // If this is a search, then add that to the filter.
    newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + (0, _util.serialize)(this.options.params);
    _formiojs2.default.request(newUrl).then(function (data) {
      // If the selectValue prop is defined, use it.
      if (this.props.component.selectValues) {
        this.setResult((0, _get2.default)(data, this.props.component.selectValues, []), append);
      }
      // Attempt to default to the formio settings for a resource.
      else if (data.hasOwnProperty('data')) {
          this.setResult(data.data, append);
        } else if (data.hasOwnProperty('items')) {
          this.setResult(data.items, append);
        }
        // Use the data itself.
        else {
            this.setResult(data, append);
          }
    }.bind(this));
  },
  loadMoreItems: function loadMoreItems(event) {
    event.stopPropagation();
    event.preventDefault();
    this.options.params.skip += this.options.params.limit;
    this.refreshItems(null, null, true);
  },
  setResult: function setResult(data, append) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    this.setState(function (previousState) {
      if (append) {
        previousState.selectItems = previousState.selectItems.concat(data);
      } else {
        previousState.selectItems = data;
      }
      previousState.hasNextPage = previousState.selectItems.length >= this.options.params.limit + this.options.params.skip;
      return previousState;
    });
  }
});