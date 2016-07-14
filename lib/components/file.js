'use strict';

var React = require('react');
var DropzoneComponent = require('react-dropzone-component');
var ReactDOMServer = require('react-dom/server');

module.exports = React.createClass({
  displayName: 'File',
  getInitialState: function getInitialState() {
    return {
      files: []
    };
  },
  fileUploadView: function fileUploadView(key, storageType, isMultiple, componentConfig, eventHandlers, djsConfig) {
    if (storageType) {
      if (!this.state.files.length > 0 || isMultiple) return React.createElement(
        'div',
        null,
        React.createElement(DropzoneComponent, { config: componentConfig,
          eventHandlers: eventHandlers,
          djsConfig: djsConfig })
      );
    } else {
      return React.createElement(
        'div',
        { key: key, className: 'formio-dropzone-default-content' },
        this.fileUploadInnerView()
      );
    }
  },
  fileUploadInnerView: function fileUploadInnerView() {
    return React.createElement(
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
        { href: '#' },
        '  browse'
      ),
      React.createElement(
        'span',
        null,
        ' .'
      )
    );
  },
  headercell: function headercell(firstCell, secCell, thirdCell) {
    return React.createElement(
      'tr',
      null,
      React.createElement(
        'th',
        { className: 'formio-dropzone-table' },
        firstCell
      ),
      React.createElement(
        'th',
        null,
        secCell
      ),
      React.createElement(
        'th',
        null,
        thirdCell
      )
    );
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
  removeRow: function removeRow(id) {
    var rows = this.state.files;
    rows.splice(id, 1);
    this.setState({
      files: rows
    });
  },
  configureTableCell: function configureTableCell(fileName, fileSize, id) {
    return React.createElement(
      'tr',
      { id: id, key: id },
      React.createElement(
        'td',
        { className: 'formio-dropzone-table' },
        React.createElement(
          'span',
          { className: 'glyphicon glyphicon-remove', onClick: this.removeRow.bind(null, id) },
          ' '
        )
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: '#' },
          fileName
        )
      ),
      React.createElement(
        'td',
        null,
        fileSize
      )
    );
  },
  render: function render() {
    var _this2 = this;

    //To Do :- Remove _this
    var _this = this;
    var tableClasses = 'table';
    var storageType = this.props.component.storage;
    var key = this.props.component.key;
    var title = this.props.component.label ? this.props.component.label : '';
    var isMultiple = this.props.component.multiple;
    var formUrl = this.props.formio.formUrl;
    var urlPath = formUrl + '/storage/' + storageType;
    var componentConfig = {
      showFiletypeIcon: false,
      postUrl: urlPath
    };

    // To Do:- add the params also need to
    var djsConfig = {
      addRemoveLinks: false,
      showFiletypeIcon: false,
      clickable: true,
      acceptedFiles: "image/jpeg,image/png,image/gif, audio/*,video/*,.pdf,.txt",
      dictCancelUpload: null,
      dictRemoveFile: null,
      maxFilesize: 15,
      params: {},
      dictDefaultMessage: "<div class=\"formio-content-centered\"><i id=\"formio-file-upload\" class=\"glyphicon glyphicon-cloud-upload\"></i><span> Drop files to attach, or</span><a  href=\"#\">  browse</a><span> .</span></div>",
      previewTemplate: ReactDOMServer.renderToStaticMarkup(React.createElement(
        'div',
        { className: 'dz-preview dz-file-preview' },
        React.createElement(
          'div',
          { className: 'dz-details' },
          React.createElement(
            'div',
            { className: 'dz-filename' },
            React.createElement('span', { 'data-dz-name': 'true' }),
            React.createElement(
              'span',
              { className: 'dz-error-mark' },
              React.createElement(
                'span',
                null,
                ' ✘'
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'progress' },
          React.createElement('div', { className: 'progress-bar', 'data-dz-uploadprogress': 'true', role: 'progressbar', 'aria-valuenow': '70',
            'aria-valuemin': '0', 'aria-valuemax': '100' })
        ),
        React.createElement(
          'div',
          { className: 'dz-error-message' },
          React.createElement('span', { 'data-dz-errormessage': 'true' })
        )
      ))
    };
    var eventHandlers = {
      uploadprogress: uploadprogress,
      success: onDrop,
      complete: uploadComplete
    };

    tableClasses += ' table-striped';
    tableClasses += ' table-bordered';
    tableClasses += ' table-hover';
    tableClasses += ' table-condensed';
    tableClasses += 'formio-dropzone-margin';

    //To Do :- Need to use 'this' instead of 'self'
    function onDrop(file) {
      var test = _this.state.files;
      test.push(file);
      _this.setState({
        files: test
      });
    }

    function uploadprogress(file, progress, bytesSent) {
      console.log("progress", progress);
    }

    function uploadComplete(file) {
      //To Do :- Remove the progress bar once complete the uploading.
    }

    return React.createElement(
      'div',
      { className: 'formio-dropzone-margin', key: key },
      title,
      React.createElement(
        'table',
        { className: tableClasses },
        React.createElement(
          'thead',
          null,
          this.headercell('', 'File Name', 'Size')
        ),
        React.createElement(
          'tbody',
          null,
          isMultiple ? this.configureTableCell('', 'NaN Bytes', 'multipleHeaderCell') : null,
          this.state.files.length > 0 ? this.state.files.map(function (File, i) {
            return _this2.configureTableCell(File.name, File.size, i);
          }) : null
        )
      ),
      React.createElement(
        'div',
        null,
        this.fileUploadView(key, storageType, isMultiple, componentConfig, eventHandlers, djsConfig)
      ),
      storageType ? null : this.noStorageError()
    );
  }
});