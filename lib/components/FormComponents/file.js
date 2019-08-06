'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormioFileList = function (_React$Component) {
  _inherits(FormioFileList, _React$Component);

  function FormioFileList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FormioFileList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FormioFileList.__proto__ || Object.getPrototypeOf(FormioFileList)).call.apply(_ref, [this].concat(args))), _this), _this.fileRow = function (file, index) {
      if (!file) {
        return null;
      }
      return _react2.default.createElement(
        'tr',
        { key: index },
        function () {
          if (!_this.props.readOnly) {
            return _react2.default.createElement(
              'td',
              { className: 'formio-dropzone-table' },
              _react2.default.createElement(
                'a',
                { onClick: _this.props.removeFile.bind(null, index), className: 'btn btn-sm btn-default' },
                _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove' })
              )
            );
          }
        }(),
        _react2.default.createElement(
          'td',
          null,
          _react2.default.createElement(FormioFile, { file: file, formio: _this.props.formio })
        ),
        _react2.default.createElement(
          'td',
          null,
          (0, _util.fileSize)(file.size)
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FormioFileList, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'table',
        { className: 'table table-striped table-bordered' },
        _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            null,
            function () {
              if (!_this2.props.readOnly) {
                return _react2.default.createElement('th', { className: 'formio-dropzone-table' });
              }
            }(),
            _react2.default.createElement(
              'th',
              null,
              'File Name'
            ),
            _react2.default.createElement(
              'th',
              null,
              'Size'
            )
          )
        ),
        _react2.default.createElement(
          'tbody',
          null,
          this.props.files ? this.props.files.map(this.fileRow) : null
        )
      );
    }
  }]);

  return FormioFileList;
}(_react2.default.Component);

FormioFileList.displayName = 'FormioFileList';

var FormioImageList = function (_React$Component2) {
  _inherits(FormioImageList, _React$Component2);

  function FormioImageList() {
    _classCallCheck(this, FormioImageList);

    return _possibleConstructorReturn(this, (FormioImageList.__proto__ || Object.getPrototypeOf(FormioImageList)).apply(this, arguments));
  }

  _createClass(FormioImageList, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _react2.default.createElement(
        'div',
        null,
        this.props.files ? this.props.files.map(function (file, index) {
          return _react2.default.createElement(
            'span',
            { key: index },
            _react2.default.createElement(FormioImage, { file: file, formio: _this4.props.formio, width: _this4.props.width }),
            function () {
              if (!_this4.props.readOnly) {
                return _react2.default.createElement(
                  'span',
                  { style: { width: '1%', 'white-space': 'nowrap' } },
                  _react2.default.createElement(
                    'a',
                    { onClick: _this4.props.removeFile.bind(null, index), className: 'btn btn-sm btn-default' },
                    _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove' })
                  )
                );
              }
            }()
          );
        }) : null
      );
    }
  }]);

  return FormioImageList;
}(_react2.default.Component);

FormioImageList.displayName = 'FormioImageList';

var FormioFile = function (_React$Component3) {
  _inherits(FormioFile, _React$Component3);

  function FormioFile() {
    var _ref2;

    var _temp2, _this5, _ret2;

    _classCallCheck(this, FormioFile);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this5 = _possibleConstructorReturn(this, (_ref2 = FormioFile.__proto__ || Object.getPrototypeOf(FormioFile)).call.apply(_ref2, [this].concat(args))), _this5), _this5.getFile = function (event) {
      event.preventDefault();
      _this5.props.formio.downloadFile(_this5.props.file).then(function (file) {
        if (file) {
          window.open(file.url, '_blank');
        }
      }).catch(function (response) {
        // Is alert the best way to do this?
        // User is expecting an immediate notification due to attempting to download a file.
        alert(response);
      });
    }, _temp2), _possibleConstructorReturn(_this5, _ret2);
  }

  _createClass(FormioFile, [{
    key: 'render',
    value: function render() {
      var _this6 = this;

      return _react2.default.createElement(
        'a',
        { href: this.props.file.url, onClick: function onClick(event) {
            _this6.getFile(event);
          }, target: '_blank' },
        this.props.file.name
      );
    }
  }]);

  return FormioFile;
}(_react2.default.Component);

FormioFile.displayName = 'FormioFile';

var FormioImage = function (_React$Component4) {
  _inherits(FormioImage, _React$Component4);

  function FormioImage() {
    var _ref3;

    var _temp3, _this7, _ret3;

    _classCallCheck(this, FormioImage);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _ret3 = (_temp3 = (_this7 = _possibleConstructorReturn(this, (_ref3 = FormioImage.__proto__ || Object.getPrototypeOf(FormioImage)).call.apply(_ref3, [this].concat(args))), _this7), _this7.state = {
      imageSrc: ''
    }, _temp3), _possibleConstructorReturn(_this7, _ret3);
  }

  _createClass(FormioImage, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this8 = this;

      this.props.formio.downloadFile(this.props.file).then(function (result) {
        _this8.setState({
          imageSrc: result.url
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('img', { src: this.state.imageSrc, alt: this.props.file.name, style: { width: this.props.width } });
    }
  }]);

  return FormioImage;
}(_react2.default.Component);

FormioImage.displayName = 'FormioImage';


module.exports = (0, _createReactClass2.default)({
  displayName: 'File',
  mixins: [_valueMixin2.default, _componentMixin2.default],
  getInitialValue: function getInitialValue() {
    return [];
  },
  componentWillMount: function componentWillMount() {
    this.setState({
      fileUploads: {}
    });
  },
  fileSelector: function fileSelector() {
    if (!this.state.value.length > 0 || this.props.component.multiple) {
      return _react2.default.createElement(
        _reactDropzone2.default,
        { onDrop: this.upload, multiple: this.props.component.multiple, className: 'formio-dropzone-default-content' },
        _react2.default.createElement(
          'div',
          { className: 'formio-content-centered' },
          _react2.default.createElement('i', { id: 'formio-file-upload', className: 'glyphicon glyphicon-cloud-upload' }),
          _react2.default.createElement(
            'span',
            null,
            ' Drop files to attach, or'
          ),
          _react2.default.createElement(
            'a',
            { style: { cursor: 'pointer' } },
            ' browse'
          ),
          _react2.default.createElement(
            'span',
            null,
            '.'
          )
        )
      );
    }
  },
  upload: function upload(files) {
    var _this9 = this;

    if (this.props.component.storage && files && files.length) {
      files.forEach(function (file) {
        // Get a unique name for this file to keep file collisions from occurring.
        var fileName = _this9.uniqueName(file.name);
        _this9.setState(function (previousState) {
          previousState.fileUploads[fileName] = {
            name: fileName,
            size: file.size,
            status: 'info',
            message: 'Starting upload'
          };
          return previousState;
        });
        var dir = _this9.props.component.dir || '';
        _this9.props.formio.uploadFile(_this9.props.component.storage, file, fileName, dir, function (evt) {
          _this9.setState(function (previousState) {
            previousState.fileUploads[fileName].status = 'progress';
            previousState.fileUploads[fileName].progress = parseInt(100.0 * evt.loaded / evt.total);
            delete previousState.fileUploads[fileName].message;
            return previousState;
          });
        }).then(function (fileInfo) {
          _this9.setState(function (previousState) {
            delete previousState.fileUploads[fileName];
            return previousState;
          });
          _this9.setValue(fileInfo, _this9.state.value.length);
        }).catch(function (response) {
          _this9.setState(function (previousState) {
            previousState.fileUploads[fileName].status = 'error';
            previousState.fileUploads[fileName].message = response;
            delete previousState.fileUploads[fileName].progress;
            return previousState;
          });
        });
      });
    }
  },
  noStorageError: function noStorageError() {
    return _react2.default.createElement(
      'div',
      { className: 'formio-dropzone-error-content' },
      _react2.default.createElement(
        'span',
        null,
        'No storage has been set for this field. File uploads are disabled until storage is set up.'
      )
    );
  },
  uniqueName: function uniqueName(name) {
    var parts = name.toLowerCase().replace(/[^0-9a-z\.]/g, '').split('.');
    var fileName = parts[0];
    var ext = '';
    if (parts.length > 1) {
      ext = '.' + parts[parts.length - 1];
    }
    return fileName.substr(0, 10) + '-' + this.guid() + ext;
  },
  guid: function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  },
  fileUpload: function fileUpload(_fileUpload, index) {
    var errorClass = _fileUpload.status === 'error' ? ' has-error' : '';
    var progressBar;
    if (_fileUpload.status === 'progress') {
      progressBar = _react2.default.createElement(
        'div',
        { className: 'progress' },
        _react2.default.createElement(
          'div',
          { className: 'progress-bar', role: 'progressbar', 'aria-valuenow': _fileUpload.progress, 'aria-valuemin': '0', 'aria-valuemax': '100', style: { width: _fileUpload.progress + '%' } },
          _react2.default.createElement(
            'span',
            { className: 'sr-only' },
            _fileUpload.progress,
            '% Complete'
          )
        )
      );
    } else {
      var className = 'bg-' + _fileUpload.status + ' control-label';
      progressBar = _react2.default.createElement(
        'div',
        { className: className },
        _fileUpload.message
      );
    }
    return _react2.default.createElement(
      'div',
      { key: index, className: 'file' + errorClass },
      _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
          'div',
          { className: 'fileName control-label col-sm-10' },
          _fileUpload.name,
          _react2.default.createElement(
            'span',
            { onClick: this.removeUpload.bind(null, index) },
            _react2.default.createElement('i', { className: 'glyphicon glyphicon-remove' })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'fileSize control-label col-sm-2 text-right' },
          (0, _util.fileSize)(_fileUpload.size)
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
          'div',
          { className: 'col-sm-12' },
          progressBar
        )
      )
    );
  },
  removeFile: function removeFile(id) {
    this.setState(function (previousState) {
      previousState.value.splice(id, 1);
      return previousState;
    });
  },
  removeUpload: function removeUpload(name) {
    this.setState(function (previousState) {
      delete previousState.fileUploads[name];
      return previousState;
    });
  },
  fileList: function fileList() {
    if (!this.props.component.image) {
      return _react2.default.createElement(FormioFileList, { files: this.state.value, formio: this.props.formio, removeFile: this.removeFile });
    } else {
      return _react2.default.createElement(FormioImageList, { files: this.state.value, formio: this.props.formio, width: this.props.component.imageSize, removeFile: this.removeFile });
    }
  },
  getElements: function getElements() {
    var _this10 = this;

    var classLabel = 'control-label' + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? _react2.default.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    var requiredInline = !this.props.component.label && this.props.component.validate && this.props.component.validate.required ? _react2.default.createElement('span', { className: 'glyphicon glyphicon-asterisk form-control-feedback field-required-inline', 'aria-hidden': 'true' }) : '';

    return _react2.default.createElement(
      'div',
      { className: 'formio-dropzone-margin' },
      inputLabel,
      ' ',
      requiredInline,
      this.fileList(),
      function () {
        if (!_this10.props.readOnly) {
          return _react2.default.createElement(
            'div',
            null,
            _this10.fileSelector(),
            _this10.props.component.storage ? null : _this10.noStorageError(),
            Object.keys(_this10.state.fileUploads).map(function (key) {
              return _this10.fileUpload(_this10.state.fileUploads[key], key);
            })
          );
        }
      }()
    );
  },
  getValueDisplay: function getValueDisplay(component, data) {
    var files = Array.isArray(data) ? data : [data];
    return _react2.default.createElement(FormioFileList, { files: files, readOnly: true });
  }
});