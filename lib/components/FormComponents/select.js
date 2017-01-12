'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _selectMixin = require('./mixins/selectMixin');

var _selectMixin2 = _interopRequireDefault(_selectMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

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
  mixins: [_valueMixin2.default, _selectMixin2.default, _componentMixin2.default],
  getValueField: function getValueField() {
    if (this.props.component.dataSrc === 'custom' || this.props.component.dataSrc === 'json') {
      return false;
    }
    if (this.props.component.dataSrc === 'resource' && this.props.component.valueProperty === '') {
      return '_id';
    }
    return this.props.component.valueProperty || 'value';
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    switch (this.props.component.dataSrc) {
      case 'values':
        this.internalFilter = true;
        this.setState({
          selectItems: this.props.component.data.values
        });
        break;
      case 'json':
        try {
          this.items = JSON.parse(this.props.component.data.json);
        } catch (error) {
          this.items = [];
        }
        this.options.params = {
          limit: 20,
          skip: 0
        };
        this.refreshItems = function (input, url, append) {
          // If they typed in a search, reset skip.
          if (_this.lastInput !== input) {
            _this.lastInput = input;
            _this.options.params.skip = 0;
          }
          var items = _this.items;
          if (input) {
            items = items.filter(function (item) {
              // This is a bit of a hack to search the whole object.
              return JSON.stringify(item).toLowerCase().includes(input.toLowerCase());
            });
          }
          items = items.slice(_this.options.params.skip, _this.options.params.skip + _this.options.params.limit);
          _this.setResult(items, append);
        };
        this.refreshItems();
        break;
      case 'custom':
        this.refreshItems = function () {
          try {
            /* eslint-disable no-unused-vars */
            var _props = _this.props,
                data = _props.data,
                row = _props.row;
            /* eslint-enable no-unused-vars */

            _this.setState({
              selectItems: eval('(function(data, row) { var values = [];' + _this.props.component.data.custom.toString() + '; return values; })(data, row)')
            });
          } catch (error) {
            _this.setState({
              selectItems: []
            });
          }
        };
        this.refreshItems();
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

        this.refreshItems = function (input, newUrl, append) {
          var _props2 = _this.props,
              data = _props2.data,
              row = _props2.row;

          newUrl = newUrl || _this.url;
          // Allow templating the url.
          newUrl = (0, _util.interpolate)(newUrl, {
            data: data,
            row: row,
            formioBase: _formiojs2.default.getBaseUrl()
          });
          if (!newUrl) {
            return;
          }

          // If this is a search, then add that to the filter.
          if (_this.props.component.searchField && input) {
            // If they typed in a search, reset skip.
            if (_this.lastInput !== input) {
              _this.lastInput = input;
              _this.options.params.skip = 0;
            }
            newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + encodeURIComponent(_this.props.component.searchField) + '=' + encodeURIComponent(input);
          }

          // Add the other filter.
          if (_this.props.component.filter) {
            var filter = (0, _util.interpolate)(_this.props.component.filter, { data: data });
            newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + filter;
          }

          // If they wish to return only some fields.
          if (_this.props.component.selectFields) {
            _this.options.params.select = _this.props.component.selectFields;
          }

          // If this is a search, then add that to the filter.
          newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + (0, _util.serialize)(_this.options.params);
          _formiojs2.default.request(newUrl).then(function (data) {
            // If the selectValue prop is defined, use it.
            if (_this.props.component.selectValues) {
              _this.setResult((0, _get2.default)(data, _this.props.component.selectValues, []), append);
            }
            // Attempt to default to the formio settings for a resource.
            else if (data.hasOwnProperty('data')) {
                _this.setResult(data.data, append);
              } else if (data.hasOwnProperty('items')) {
                _this.setResult(data.items, append);
              }
              // Use the data itself.
              else {
                  _this.setResult(data, append);
                }
          });
        };

        this.refreshItems();

        break;
      default:
        this.setState({
          selectItems: []
        });
    }
  },
  refreshItems: function refreshItems() {},
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
  },
  getValueDisplay: function getValueDisplay(component, data) {
    var getItem = function getItem(data) {
      switch (component.dataSrc) {
        case 'values':
          component.data.values.forEach(function (item) {
            if (item.value === data) {
              data = item;
            }
          });
          return data;
        case 'json':
          if (component.valueProperty) {
            var selectItems;
            try {
              selectItems = angular.fromJson(component.data.json);
            } catch (error) {
              selectItems = [];
            }
            selectItems.forEach(function (item) {
              if (item[component.valueProperty] === data) {
                data = item;
              }
            });
          }
          return data;
        // TODO: implement url and resource view.
        case 'url':
        case 'resource':
        default:
          return data;
      }
    };
    if (component.multiple && Array.isArray(data)) {
      return data.map(getItem).reduce(function (prev, item) {
        var value;
        if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
          value = _react2.default.createElement('span', (0, _util.raw)((0, _util.interpolate)(component.template, { item: item })));
        } else {
          value = item;
        }
        return (prev === '' ? '' : ', ') + value;
      }, '');
    } else {
      var item = getItem(data);
      var value;
      if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
        value = _react2.default.createElement('span', (0, _util.raw)((0, _util.interpolate)(component.template, { item: item })));
      } else {
        value = item;
      }
      return value;
    }
  }
});