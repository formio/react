'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageSizes = exports.PageSize = exports.Operations = exports.Operation = exports.Columns = exports.Column = exports.AllItemsPerPage = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AllItemsPerPage = exports.AllItemsPerPage = 'all';

var Column = exports.Column = _propTypes2.default.shape({
  key: _propTypes2.default.string.isRequired,
  sort: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string, _propTypes2.default.func]),
  title: _propTypes2.default.string,
  value: _propTypes2.default.func,
  width: _propTypes2.default.number
});

var Columns = exports.Columns = _propTypes2.default.arrayOf(Column);

var Operation = exports.Operation = _propTypes2.default.shape({
  action: _propTypes2.default.string.isRequired,
  buttonType: _propTypes2.default.string,
  icon: _propTypes2.default.string,
  permissionsResolver: _propTypes2.default.func,
  title: _propTypes2.default.string
});

var Operations = exports.Operations = _propTypes2.default.arrayOf(Operation);

var PageSize = exports.PageSize = _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.shape({
  label: _propTypes2.default.string,
  value: _propTypes2.default.number
}), _propTypes2.default.oneOf([AllItemsPerPage])]);

var PageSizes = exports.PageSizes = _propTypes2.default.arrayOf(PageSize);