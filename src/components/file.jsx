var React = require('react');
var Dropzone = require('react-dropzone');

var FormioFileList = React.createClass({
  displayName: 'FormioFileList',
  fileRow: function (file, id) {
    return (
      <tr key={id}>
        <td className='formio-dropzone-table'>
          <a onClick={this.props.removeFile.bind(null, id)} className='btn btn-sm btn-default'><span className='glyphicon glyphicon-remove'></span></a>
        </td>
        <td><a href='#'>{file.name}</a></td>
        <td>{ this.fileSize(file.size) }</td>
      </tr>
    );
  },
  render: function() {
    return (
      <table className='table table-striped table-bordered'>
        <thead>
        <tr>
          <th className='formio-dropzone-table'></th>
          <th>File Name</th>
          <th>Size</th>
        </tr>
        </thead>
        <tbody>
          { this.props.files.map(this.fileRow) }
        </tbody>
      </table>
    );
  }
});

module.exports = React.createClass({
  displayName: 'File',
  getInitialState: function () {
    return {
      value: this.props.value || [],
      fileUploads: {}
    };
  },
  fileSelector: function () {
    if (!this.state.value.length > 0 || this.props.component.multiple) {
      return (
        <Dropzone onDrop={this.upload} multiple={this.props.component.multiple} className='formio-dropzone-default-content'>
          <div className='formio-content-centered'>
            <i id='formio-file-upload' className='glyphicon glyphicon-cloud-upload'></i>
            <span> Drop files to attach, or</span>
            <a style={{ cursor: 'pointer'}}> browse</a><span>.</span>
          </div>
        </Dropzone>
      );
    }
  },
  upload: function(files) {
    if (this.props.component.storage && files && files.length) {
      files.forEach((file) => {
        // Get a unique name for this file to keep file collisions from occurring.
        var fileName = this.uniqueName(file.name);
        this.setState((previousState) => {
          previousState.fileUploads[fileName] = {
            name: fileName,
            size: file.size,
            status: 'info',
            message: 'Starting upload'
          };
          return previousState;
        });
        var dir = this.props.component.dir || '';
        this.props.formio.uploadFile(this.props.component.storage, file, fileName, dir, function processNotify(evt) {
            this.setState((previousState) => {
              previousState.fileUploads[fileName].status = 'progress';
              previousState.fileUploads[fileName].progress = parseInt(100.0 * evt.loaded / evt.total);
              delete previousState.fileUploads[fileName].message;
              return previousState;
            });
          })
          .then(function(fileInfo) {
            this.setState((previousState) => {
              delete previousState.fileUploads[fileName];
              previousState.value.push(fileInfo);
              return previousState;
            });
          })
          .catch(function(response) {
            // Handle error
            var oParser = new DOMParser();
            var oDOM = oParser.parseFromString(response.data, 'text/xml');
            var message = oDOM.getElementsByTagName('Message')[0].innerHTML;

            this.setState((previousState) => {
              previousState.fileUploads[fileName].status = 'error';
              previousState.fileUploads[fileName].message = message;
              delete previousState.fileUploads[fileName].progress;
              return previousState;
            });
          });
      });
    }
  },
  noStorageError: function () {
    return (
      <div className='formio-dropzone-error-content'>
        <span>No storage has been set for this field. File uploads are disabled until storage is set up.</span>
      </div>
    );
  },
  fileSize: function(a, b, c, d, e) {
    return (b = Math, c = b.log, d = 1024, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) + ' ' + (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes');
  },
  uniqueName: function(name) {
    var parts = name.toLowerCase().replace(/[^0-9a-z\.]/g, '').split('.');
    var fileName = parts[0];
    var ext = '';
    if (parts.length > 1) {
      ext = '.' + parts[(parts.length - 1)];
    }
    return fileName.substr(0, 10) + '-' + this.guid() + ext;
  },
  guid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },
  fileUpload: function(fileUpload, index) {
    var errorClass = (fileUpload.status === 'error' ? ' has-error' : '');
    var progressBar;
    if (fileUpload.status === 'progress') {
      progressBar = (
        <div className='progress'>
          <div className='progress-bar' role='progressbar' aria-valuenow={fileUpload.progress} aria-valuemin='0' aria-valuemax='100' style={{width: fileUpload.progress + '%'}}>
            <span className='sr-only'>{fileUpload.progress}% Complete</span>
          </div>
        </div>
      );
    }
    else {
      var className = 'bg-' +  fileUpload.status + ' control-label';
      progressBar = (
        <div className={className}>{ fileUpload.message }</div>
      );
    }
    return (
      <div key={index} className={'file' + errorClass}>
        <div className='row'>
          <div className='fileName control-label col-sm-10'>
            { fileUpload.name }
            <span onclick={this.removeUpload.bind(this, fileUpload.name)} className='glyphicon glyphicon-remove'></span>
          </div>
          <div className='fileSize control-label col-sm-2 text-right'>
            { this.fileSize(fileUpload.size) }
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            { progressBar }
          </div>
        </div>
      </div>
    );
  },
  removeFile: function (id) {
    this.setState(function(previousState) {
      previousState.value.splice(id, 1);
      return previousState;
    });
  },
  removeUpload: function (name) {
    this.setState(function(previousState) {
      delete previousState.fileUploads[name];
      return previousState;
    });
  },
  render: function () {
    var classLabel = 'control-label' + ( this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = (this.props.component.label && !this.props.component.hideLabel ?
      <label htmlFor={this.props.component.key} className={classLabel}>{this.props.component.label}</label> : '');
    var requiredInline = (!this.props.component.label && this.props.component.validate && this.props.component.validate.required ?
      <span className='glyphicon glyphicon-asterisk form-control-feedback field-required-inline' aria-hidden='true'></span> : '');

    return (
      <div className='formio-dropzone-margin'>
        {inputLabel} {requiredInline}
        <FormioFileList files={this.state.value} formio={this.props.formio} removeFile={this.removeFile}></FormioFileList>
        {this.fileSelector()}
        {this.props.component.storage ? null : this.noStorageError()}
      </div>
    );
  }
});
