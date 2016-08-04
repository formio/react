'use strict';

var React = require('react');
var Dropzone = require('react-dropzone');

var FormioFileList = React.createClass({
  displayName: 'FormioFileList',
  fileRow: function fileRow(file, id) {
    return React.createElement(
      'tr',
      { key: id },
      React.createElement(
        'td',
        { className: 'formio-dropzone-table' },
        React.createElement(
          'a',
          { onClick: this.props.removeFile.bind(null, id), className: 'btn btn-sm btn-default' },
          React.createElement('span', { className: 'glyphicon glyphicon-remove' })
        )
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: '#' },
          file.name
        )
      ),
      React.createElement(
        'td',
        null,
        this.fileSize(file.size)
      )
    );
  },
  render: function render() {
    return React.createElement(
      'table',
      { className: 'table table-striped table-bordered' },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement('th', { className: 'formio-dropzone-table' }),
          React.createElement(
            'th',
            null,
            'File Name'
          ),
          React.createElement(
            'th',
            null,
            'Size'
          )
        )
      ),
      React.createElement(
        'tbody',
        null,
        this.props.files.map(this.fileRow)
      )
    );
  }
});

module.exports = React.createClass({
  displayName: 'File',
  getInitialState: function getInitialState() {
    return {
      value: this.props.value || [],
      fileUploads: {}
    };
  },
  fileSelector: function fileSelector() {
    if (!this.state.value.length > 0 || this.props.component.multiple) {
      return React.createElement(
        Dropzone,
        { onDrop: this.upload, multiple: this.props.component.multiple, className: 'formio-dropzone-default-content' },
        React.createElement(
          'div',
          { className: 'formio-content-centered' },
          React.createElement('i', { id: 'formio-file-upload', className: 'glyphicon glyphicon-cloud-upload' }),
          React.createElement(
            'span',
            null,
            ' Drop files to attach, or'
          ),
          React.createElement(
            'a',
            { style: { cursor: 'pointer' } },
            ' browse'
          ),
          React.createElement(
            'span',
            null,
            '.'
          )
        )
      );
    }
  },
  upload: function upload(files) {
    var _this = this;

    if (this.props.component.storage && files && files.length) {
      files.forEach(function (file) {
        // Get a unique name for this file to keep file collisions from occurring.
        var fileName = _this.uniqueName(file.name);
        _this.setState(function (previousState) {
          previousState.fileUploads[fileName] = {
            name: fileName,
            size: file.size,
            status: 'info',
            message: 'Starting upload'
          };
          return previousState;
        });
        var dir = _this.props.component.dir || '';
        _this.props.formio.uploadFile(_this.props.component.storage, file, fileName, dir, function processNotify(evt) {
          this.setState(function (previousState) {
            previousState.fileUploads[fileName].status = 'progress';
            previousState.fileUploads[fileName].progress = parseInt(100.0 * evt.loaded / evt.total);
            delete previousState.fileUploads[fileName].message;
            return previousState;
          });
        }).then(function (fileInfo) {
          this.setState(function (previousState) {
            delete previousState.fileUploads[fileName];
            previousState.value.push(fileInfo);
            return previousState;
          });
        }).catch(function (response) {
          // Handle error
          var oParser = new DOMParser();
          var oDOM = oParser.parseFromString(response.data, 'text/xml');
          var message = oDOM.getElementsByTagName('Message')[0].innerHTML;

          this.setState(function (previousState) {
            previousState.fileUploads[fileName].status = 'error';
            previousState.fileUploads[fileName].message = message;
            delete previousState.fileUploads[fileName].progress;
            return previousState;
          });
        });
      });
    }
  },
  noStorageError: function noStorageError() {
    return React.createElement(
      'div',
      { className: 'formio-dropzone-error-content' },
      React.createElement(
        'span',
        null,
        'No storage has been set for this field. File uploads are disabled until storage is set up.'
      )
    );
  },
  fileSize: function fileSize(a, b, c, d, e) {
    return (b = Math, c = b.log, d = 1024, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) + ' ' + (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes');
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
      progressBar = React.createElement(
        'div',
        { className: 'progress' },
        React.createElement(
          'div',
          { className: 'progress-bar', role: 'progressbar', 'aria-valuenow': _fileUpload.progress, 'aria-valuemin': '0', 'aria-valuemax': '100', style: { width: _fileUpload.progress + '%' } },
          React.createElement(
            'span',
            { className: 'sr-only' },
            _fileUpload.progress,
            '% Complete'
          )
        )
      );
    } else {
      var className = 'bg-' + _fileUpload.status + ' control-label';
      progressBar = React.createElement(
        'div',
        { className: className },
        _fileUpload.message
      );
    }
    return React.createElement(
      'div',
      { key: index, className: 'file' + errorClass },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'fileName control-label col-sm-10' },
          _fileUpload.name,
          React.createElement('span', { onclick: this.removeUpload.bind(this, _fileUpload.name), className: 'glyphicon glyphicon-remove' })
        ),
        React.createElement(
          'div',
          { className: 'fileSize control-label col-sm-2 text-right' },
          this.fileSize(_fileUpload.size)
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
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
  render: function render() {
    var classLabel = 'control-label' + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? React.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    var requiredInline = !this.props.component.label && this.props.component.validate && this.props.component.validate.required ? React.createElement('span', { className: 'glyphicon glyphicon-asterisk form-control-feedback field-required-inline', 'aria-hidden': 'true' }) : '';

    return React.createElement(
      'div',
      { className: 'formio-dropzone-margin' },
      inputLabel,
      ' ',
      requiredInline,
      React.createElement(FormioFileList, { files: this.state.value, formio: this.props.formio, removeFile: this.removeFile }),
      this.fileSelector(),
      this.props.component.storage ? null : this.noStorageError()
    );
  }
});