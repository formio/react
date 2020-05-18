'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var LEFT_PAGE = 'LEFT';
var RIGHT_PAGE = 'RIGHT';

function range(from, to) {
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var i = from;
  var range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
}

function getPageNumbers(_ref) {
  var currentPage = _ref.currentPage,
      pageNeighbours = _ref.pageNeighbours,
      totalPages = _ref.totalPages;

  var totalNumbers = pageNeighbours * 2 + 3;
  var totalBlocks = totalNumbers + 2;

  if (totalPages > totalBlocks) {
    var calculatedStartPage = Math.max(2, currentPage - pageNeighbours);
    var calculatedEndPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
    var startPage = calculatedStartPage === 3 ? 2 : calculatedStartPage;
    var endPage = calculatedEndPage === totalPages - 2 ? totalPages - 1 : calculatedEndPage;

    var pages = range(startPage, endPage);

    var hasLeftSpill = startPage > 2;
    var hasRightSpill = totalPages - endPage > 1;
    var spillOffset = totalNumbers - (pages.length + 1);
    var extraPages = void 0;

    if (hasLeftSpill && !hasRightSpill) {
      extraPages = range(startPage - spillOffset, startPage - 1);
      pages = [LEFT_PAGE].concat(_toConsumableArray(extraPages), _toConsumableArray(pages));
    } else if (!hasLeftSpill && hasRightSpill) {
      extraPages = range(endPage + 1, endPage + spillOffset);
      pages = [].concat(_toConsumableArray(pages), _toConsumableArray(extraPages), [RIGHT_PAGE]);
    } else {
      pages = [LEFT_PAGE].concat(_toConsumableArray(pages), [RIGHT_PAGE]);
    }

    return [1].concat(_toConsumableArray(pages), [totalPages]);
  }

  return range(1, totalPages);
}

function Pagination(_ref2) {
  var activePage = _ref2.activePage,
      pageNeighbours = _ref2.pageNeighbours,
      pages = _ref2.pages,
      prev = _ref2.prev,
      next = _ref2.next,
      onSelect = _ref2.onSelect;

  var pageNumbers = getPageNumbers({
    currentPage: activePage,
    pageNeighbours: pageNeighbours,
    totalPages: pages
  });

  return _react2.default.createElement(
    'nav',
    { 'aria-label': 'Page navigation' },
    _react2.default.createElement(
      'ul',
      { className: 'pagination' },
      _react2.default.createElement(
        'li',
        { className: 'page-item ' + (activePage === 1 ? 'disabled' : '') },
        _react2.default.createElement(
          'a',
          {
            className: 'page-link',
            onClick: function onClick() {
              if (activePage !== 1) {
                onSelect(activePage - 1);
              }
            },
            href: 'javascript:void(0)'
          },
          prev
        )
      ),
      pageNumbers.map(function (page) {
        var className = page === activePage ? 'active' : '';

        if ([LEFT_PAGE, RIGHT_PAGE].includes(page)) {
          return _react2.default.createElement(
            'li',
            { className: 'page-item disabled' },
            _react2.default.createElement(
              'span',
              { className: 'page-link' },
              _react2.default.createElement(
                'span',
                { 'aria-hidden': 'true' },
                '...'
              )
            )
          );
        }

        return _react2.default.createElement(
          'li',
          { className: 'page-item ' + className, key: page },
          _react2.default.createElement(
            'a',
            {
              className: 'page-link',
              onClick: function onClick() {
                return onSelect(page);
              },
              href: 'javascript:void(0)'
            },
            page
          )
        );
      }),
      _react2.default.createElement(
        'li',
        { className: 'page-item ' + (activePage === pages ? 'disabled' : '') },
        _react2.default.createElement(
          'a',
          {
            className: 'page-link',
            onClick: function onClick() {
              if (activePage !== pages) {
                onSelect(activePage + 1);
              }
            },
            href: 'javascript:void(0)'
          },
          next
        )
      )
    )
  );
}

Pagination.propTypes = {
  activePage: _propTypes2.default.number,
  pageNeighbours: _propTypes2.default.number,
  pages: _propTypes2.default.number.isRequired,
  prev: _propTypes2.default.string,
  next: _propTypes2.default.string,
  onSelect: _propTypes2.default.func.isRequired
};

Pagination.defaultProps = {
  activePage: 1,
  pageNeighbours: 1,
  prev: 'Previous',
  next: 'Next'
};

exports.default = Pagination;