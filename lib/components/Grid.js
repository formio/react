'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _constants = require('../constants');

var _types = require('../types');

var _Pagination = require('./Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function normalizePageSize(pageSize) {
  if ((0, _isObject3.default)(pageSize)) {
    return pageSize;
  }

  if (pageSize === _types.AllItemsPerPage) {
    return {
      label: 'All',
      value: 999999
    };
  }

  return {
    label: pageSize,
    value: pageSize
  };
}

var renderPagination = function renderPagination(_ref) {
  var pages = _ref.pages,
      onPage = _ref.onPage;
  return pages && onPage;
};

var renderPageSizeSelector = function renderPageSizeSelector(_ref2) {
  var pageSize = _ref2.pageSize,
      pageSizes = _ref2.pageSizes,
      onPageSizeChanged = _ref2.onPageSizeChanged;
  return pageSize && pageSizes && pageSizes.length && onPageSizeChanged;
};

var renderItemCounter = function renderItemCounter(_ref3) {
  var firstItem = _ref3.firstItem,
      lastItem = _ref3.lastItem,
      total = _ref3.total;
  return firstItem && lastItem && total;
};

var renderFooter = function renderFooter(props) {
  return renderPagination(props) || renderItemCounter(props);
};

function Grid(props) {
  var Cell = props.Cell,
      activePage = props.activePage,
      columns = props.columns,
      emptyText = props.emptyText,
      firstItem = props.firstItem,
      items = props.items,
      lastItem = props.lastItem,
      onAction = props.onAction,
      onPage = props.onPage,
      onPageSizeChanged = props.onPageSizeChanged,
      onSort = props.onSort,
      pageNeighbours = props.pageNeighbours,
      pageSize = props.pageSize,
      pageSizes = props.pageSizes,
      pages = props.pages,
      sortOrder = props.sortOrder,
      total = props.total;

  var normalizedPageSizes = pageSizes.map(normalizePageSize);

  return _react2.default.createElement(
    'div',
    null,
    items.length ? _react2.default.createElement(
      'ul',
      { className: 'list-group list-group-striped' },
      _react2.default.createElement(
        'li',
        { className: 'list-group-item list-group-header hidden-xs hidden-md' },
        _react2.default.createElement(
          'div',
          { className: 'row' },
          columns.map(function (column) {
            var key = column.key,
                _column$sort = column.sort,
                sort = _column$sort === undefined ? false : _column$sort,
                _column$title = column.title,
                title = _column$title === undefined ? '' : _column$title,
                width = column.width;

            var className = 'col col-md-' + width;

            var columnProps = {
              key: key,
              className: className
            };

            if (!title) {
              return _react2.default.createElement('div', columnProps);
            }

            if (!sort) {
              return _react2.default.createElement(
                'div',
                columnProps,
                _react2.default.createElement(
                  'strong',
                  null,
                  title
                )
              );
            }

            var sortKey = (0, _isString3.default)(sort) ? sort : key;
            var ascSort = sortKey;
            var descSort = '-' + sortKey;

            var sortClass = '';
            if (sortOrder === ascSort) {
              sortClass = 'glyphicon glyphicon-triangle-top fa fa-caret-up';
            } else if (sortOrder === descSort) {
              sortClass = 'glyphicon glyphicon-triangle-bottom fa fa-caret-down';
            }

            return _react2.default.createElement(
              'div',
              columnProps,
              _react2.default.createElement(
                'span',
                {
                  style: { cursor: 'pointer' },
                  onClick: function onClick() {
                    return onSort(column);
                  }
                },
                _react2.default.createElement(
                  'strong',
                  null,
                  title,
                  ' ',
                  _react2.default.createElement('span', { className: sortClass })
                )
              )
            );
          })
        )
      ),
      items.map(function (item) {
        return _react2.default.createElement(
          'li',
          { className: 'list-group-item', key: item._id },
          _react2.default.createElement(
            'div',
            { className: 'row', onClick: function onClick() {
                return onAction(item, 'row');
              } },
            columns.map(function (column) {
              return _react2.default.createElement(
                'div',
                { key: column.key, className: 'col col-md-' + column.width },
                _react2.default.createElement(Cell, { row: item, column: column })
              );
            })
          )
        );
      }),
      renderFooter(props) ? _react2.default.createElement(
        'li',
        { className: 'list-group-item' },
        _react2.default.createElement(
          'div',
          { className: 'row align-items-center' },
          renderPagination(props) ? _react2.default.createElement(
            'div',
            { className: 'col-auto' },
            _react2.default.createElement(
              'div',
              { className: 'row align-items-center' },
              _react2.default.createElement(
                'div',
                { className: 'col-auto' },
                _react2.default.createElement(_Pagination2.default, {
                  pages: pages,
                  activePage: activePage,
                  pageNeighbours: pageNeighbours,
                  prev: 'Previous',
                  next: 'Next',
                  onSelect: onPage
                })
              ),
              renderPageSizeSelector(props) ? _react2.default.createElement(
                'div',
                { className: 'col-auto' },
                _react2.default.createElement(
                  'div',
                  { className: 'row align-items-center' },
                  _react2.default.createElement(
                    'div',
                    { className: 'col-auto' },
                    _react2.default.createElement(
                      'select',
                      {
                        className: 'form-control',
                        value: pageSize,
                        onChange: function onChange(event) {
                          return onPageSizeChanged(event.target.value);
                        }
                      },
                      normalizedPageSizes.map(function (_ref4) {
                        var label = _ref4.label,
                            value = _ref4.value;
                        return _react2.default.createElement(
                          'option',
                          { key: value, value: value },
                          label
                        );
                      })
                    )
                  ),
                  _react2.default.createElement(
                    'span',
                    { className: 'col-auto' },
                    'items per page'
                  )
                )
              ) : null
            )
          ) : null,
          renderItemCounter(props) ? _react2.default.createElement(
            'div',
            { className: 'col-auto ml-auto' },
            _react2.default.createElement(
              'span',
              { className: 'item-counter pull-right' },
              _react2.default.createElement(
                'span',
                { className: 'page-num' },
                firstItem,
                ' - ',
                lastItem
              ),
              ' / ',
              total,
              ' total'
            )
          ) : null
        )
      ) : null
    ) : _react2.default.createElement(
      'div',
      null,
      emptyText
    )
  );
}

Grid.propTypes = {
  Cell: _propTypes2.default.func,
  activePage: _propTypes2.default.number,
  columns: _propTypes2.default.array.isRequired,
  emptyText: _propTypes2.default.string,
  firstItem: _propTypes2.default.number,
  items: _propTypes2.default.array.isRequired,
  lastItem: _propTypes2.default.number,
  onAction: _propTypes2.default.func,
  onPage: _propTypes2.default.func,
  onPageSizeChanged: _propTypes2.default.func,
  onSort: _propTypes2.default.func,
  pageNeighbours: _propTypes2.default.number,
  pageSize: _propTypes2.default.number,
  pageSizes: _types.PageSizes,
  pages: _propTypes2.default.number,
  sortOrder: _propTypes2.default.string,
  total: _propTypes2.default.number
};

Grid.defaultProps = {
  Cell: function Cell(_ref5) {
    var column = _ref5.column,
        row = _ref5.row;
    return _react2.default.createElement(
      'span',
      null,
      (0, _get3.default)(row, column.key, '')
    );
  },
  activePage: 1,
  emptyText: 'No data found',
  firstItem: 0,
  lastItem: 0,
  onAction: function onAction() {},
  onPage: function onPage() {},
  onPageSizeChanged: function onPageSizeChanged() {},
  onSort: function onSort() {},
  pageNeighbours: 1,
  pageSize: 0,
  pageSizes: _constants.defaultPageSizes,
  pages: 0,
  sortOrder: '',
  total: 0
};

exports.default = Grid;