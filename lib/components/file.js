'use strict';

var React = require('react');
var Dropzone = require('react-dropzone');
var Formiojs = require('formiojs');
var FormioUtils = require('formio-utils');

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
          { onClick: this.props.removeFile.bind(null, id), 'class': 'btn btn-sm btn-default' },
          React.createElement('span', { 'class': 'glyphicon glyphicon-remove' })
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
      fileUploads: []
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
      files.forEach(files, function (file) {
        // Get a unique name for this file to keep file collisions from occurring.
        var fileName = FormioUtils.uniqueName(file.name);
        _this.setState(function (previousState) {
          previousState.fileUploads[fileName] = {
            name: fileName,
            size: file.size,
            status: 'info',
            message: 'Starting upload'
          };
          return previousState;
        });
        var dir = $scope.component.dir || '';
        _this.props.formio.uploadFile($scope.component.storage, file, fileName, dir, function processNotify(evt) {
          this.setState(function (previousState) {
            previousState.fileUploads[fileName].status = 'progress';
            previousState.fileUploads[fileName].progress = parseInt(100.0 * evt.loaded / evt.total);
            delete previousState.fileUploads[fileName].message;
            return previousState;
          });
        }).then(function (fileInfo) {
          this.setState(function (previousState) {
            delete $scope.fileUploads[fileName];
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
  removeFile: function removeFile(id) {
    this.setState(function (previousState) {
      previousState.value.splice(id, 1);
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