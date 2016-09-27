'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormioFileList = _react2.default.createClass({
  displayName: 'FormioFileList',
  fileRow: function fileRow(file, id) {
    var _this = this;

    if (!file) {
      return null;
    }
    return _react2.default.createElement(
      'tr',
      { key: id },
      function () {
        if (!_this.props.readOnly) {
          return _react2.default.createElement(
            'td',
            { className: 'formio-dropzone-table' },
            _react2.default.createElement(
              'a',
              { onClick: _this.props.removeFile.bind(null, id), className: 'btn btn-sm btn-default' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove' })
            )
          );
        }
      }(),
      _react2.default.createElement(
        'td',
        null,
        _react2.default.createElement(
          'a',
          { href: '#' },
          file.name
        )
      ),
      _react2.default.createElement(
        'td',
        null,
        (0, _util.fileSize)(file.size)
      )
    );
  },
  render: function render() {
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
        this.props.files.map(this.fileRow)
      )
    );
  }
});

module.exports = _react2.default.createClass({
  displayName: 'File',
  mixins: [_valueMixin2.default],
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
    var _this3 = this;

    if (this.props.component.storage && files && files.length) {
      files.forEach(function (file) {
        // Get a unique name for this file to keep file collisions from occurring.
        var fileName = _this3.uniqueName(file.name);
        _this3.setState(function (previousState) {
          previousState.fileUploads[fileName] = {
            name: fileName,
            size: file.size,
            status: 'info',
            message: 'Starting upload'
          };
          return previousState;
        });
        var dir = _this3.props.component.dir || '';
        _this3.props.formio.uploadFile(_this3.props.component.storage, file, fileName, dir, function (evt) {
          _this3.setState(function (previousState) {
            previousState.fileUploads[fileName].status = 'progress';
            previousState.fileUploads[fileName].progress = parseInt(100.0 * evt.loaded / evt.total);
            delete previousState.fileUploads[fileName].message;
            return previousState;
          });
        }).then(function (fileInfo) {
          _this3.setState(function (previousState) {
            delete previousState.fileUploads[fileName];
            return previousState;
          });
          _this3.setValue(fileInfo, _this3.state.value.length);
        }).catch(function (response) {
          _this3.setState(function (previousState) {
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
  getElements: function getElements() {
    var _this4 = this;

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
      _react2.default.createElement(FormioFileList, { files: this.state.value, formio: this.props.formio, removeFile: this.removeFile }),
      this.fileSelector(),
      this.props.component.storage ? null : this.noStorageError(),
      Object.keys(this.state.fileUploads).map(function (key) {
        return _this4.fileUpload(_this4.state.fileUploads[key], key);
      })
    );
  },
  getValueDisplay: function getValueDisplay(component, data) {
    return _react2.default.createElement(FormioFileList, { files: data, readOnly: true });
  }
});