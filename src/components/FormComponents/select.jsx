import React from 'react';
import valueMixin from './mixins/valueMixin';
import selectMixin from './mixins/selectMixin';
import componentMixin from './mixins/componentMixin';
import formiojs from 'formiojs';
import { interpolate, serialize, raw } from '../../util';
import get from 'lodash/get';
import debounce from 'lodash/debounce';

module.exports = React.createClass({
  options: {},
  lastInput: '',
  displayName: 'Select',
  mixins: [valueMixin, selectMixin, componentMixin],
  getValueField: function() {
    if (this.props.component.dataSrc === 'custom' || this.props.component.dataSrc === 'json') {
      return false;
    }
    if (this.props.component.dataSrc === 'resource' && this.props.component.valueProperty === '') {
      return '_id';
    }
    return this.props.component.valueProperty || 'value';
  },
  componentWillMount: function() {
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
        }
        catch (error) {
          this.items = [];
        }
        this.options.params = {
          limit: 20,
          skip: 0
        };
        this.refreshItems = (input, url, append) => {
          // If they typed in a search, reset skip.
          if (this.lastInput !== input) {
            this.lastInput = input;
            this.options.params.skip = 0;
          }
          let items = this.items;
          if (input) {
            items = items.filter(item => {
              // This is a bit of a hack to search the whole object.
              return JSON.stringify(item).toLowerCase().includes(input.toLowerCase());
            });
          }
          items = items.slice(this.options.params.skip, this.options.params.skip + this.options.params.limit);
          this.setResult(items, append);
        };
        this.refreshItems();
        break;
      case 'custom':
        this.refreshItems = () => {
          try {
            /* eslint-disable no-unused-vars */
            const { data, row } = this.props;
            /* eslint-enable no-unused-vars */
            this.setState({
              selectItems: eval('(function(data, row) { var values = [];' + this.props.component.data.custom.toString() + '; return values; })(data, row)')
            });
          }
          catch (error) {
            this.setState({
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
            this.url = formiojs.getBaseUrl() + this.props.component.data.url;
          }

          // Disable auth for outgoing requests.
          if (!this.props.component.authenticate && this.url.indexOf(formiojs.getBaseUrl()) === -1) {
            this.options = {
              disableJWT: true,
              headers: {
                Authorization: undefined,
                Pragma: undefined,
                'Cache-Control': undefined
              }
            };
          }
        }
        else {
          this.url = formiojs.getBaseUrl();
          if (this.props.component.data.project) {
            this.url += '/project/' + this.props.component.data.project;
          }
          this.url += '/form/'  + this.props.component.data.resource + '/submission';
        }

        this.options.params = {
          limit: 100,
          skip: 0
        };

        this.refreshItems = (input, newUrl, append) => {
          let { data, row } = this.props;
          newUrl = newUrl || this.url;
          // Allow templating the url.
          newUrl = interpolate(newUrl, {
            data,
            row,
            formioBase: formiojs.getBaseUrl()
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
            newUrl += ((newUrl.indexOf('?') === -1) ? '?' : '&') +
              encodeURIComponent(this.props.component.searchField) +
              '=' +
              encodeURIComponent(input);
          }

          // Add the other filter.
          if (this.props.component.filter) {
            var filter = interpolate(this.props.component.filter, {data});
            newUrl += ((newUrl.indexOf('?') === -1) ? '?' : '&') + filter;
          }

          // If they wish to return only some fields.
          if (this.props.component.selectFields) {
            this.options.params.select = this.props.component.selectFields;
          }

          // If this is a search, then add that to the filter.
          newUrl += ((newUrl.indexOf('?') === -1) ? '?' : '&') + serialize(this.options.params);
          formiojs.request(newUrl).then(data => {
            // If the selectValue prop is defined, use it.
            if (this.props.component.selectValues) {
              this.setResult(get(data, this.props.component.selectValues, []), append);
            }
            // Attempt to default to the formio settings for a resource.
            else if (data.hasOwnProperty('data')) {
              this.setResult(data.data, append);
            }
            else if (data.hasOwnProperty('items')) {
              this.setResult(data.items, append);
            }
            // Use the data itself.
            else {
              this.setResult(data, append);
            }
          });
        }

        this.refreshItems();

        break;
      default:
        this.setState({
          selectItems: []
        });
    }
  },
  refreshItems: function() {},
  loadMoreItems: function(event) {
    event.stopPropagation();
    event.preventDefault();
    this.options.params.skip += this.options.params.limit;
    this.refreshItems(null, null, true);
  },
  setResult: function(data, append) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    this.setState(function(previousState) {
      if (append) {
        previousState.selectItems = previousState.selectItems.concat(data);
      }
      else {
        previousState.selectItems = data;
      }
      previousState.hasNextPage = previousState.selectItems.length >= (this.options.params.limit + this.options.params.skip);
      return previousState;
    });
  },
  getValueDisplay: function(component, data) {
    var getItem = function(data) {
      switch (component.dataSrc) {
        case 'values':
          component.data.values.forEach(function(item) {
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
            }
            catch (error) {
              selectItems = [];
            }
            selectItems.forEach(function(item) {
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
      return data.map(getItem).reduce(function(prev, item) {
        var value;
        if (typeof item === 'object') {
          value = React.createElement('span', raw(interpolate(component.template, {item})));
        }
        else {
          value = item;
        }
        return (prev === '' ? '' : ', ') + value;
      }, '');
    }
    else {
      var item = getItem(data);
      var value;
      if (typeof item === 'object') {
        value = React.createElement('span', raw(interpolate(component.template, {item})));
      }
      else {
        value = item;
      }
      return value;
    }
  }
});
