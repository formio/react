import React from 'react';
import Dropzone from 'react-dropzone';
import valueMixin from './mixins/valueMixin';
import { fileSize } from '../../util';

const FormioFileList = React.createClass({
  displayName: 'FormioFileList',
  fileRow: function (file, index) {
    if (!file) {
      return null;
    }
    return (
      <tr key={index}>
        {(() => {
          if (!this.props.readOnly) {
            return (
              <td className='formio-dropzone-table'>
                <a onClick={this.props.removeFile.bind(null, index)} className='btn btn-sm btn-default'><span className='glyphicon glyphicon-remove'></span></a>
              </td>
            );
          }
        })()}
        <td>
          <FormioFile file={file} formio={this.props.formio} />
        </td>
        <td>{ fileSize(file.size) }</td>
      </tr>
    );
  },
  render: function() {
    return (
      <table className='table table-striped table-bordered'>
        <thead>
        <tr>
          {(() => {
            if (!this.props.readOnly) {
              return (
                <th className='formio-dropzone-table'></th>
              );
            }
          })()}
          <th>File Name</th>
          <th>Size</th>
        </tr>
        </thead>
        <tbody>
          { this.props.files ? this.props.files.map(this.fileRow) : '' }
        </tbody>
      </table>
    );
  }
});

const FormioImageList = React.createClass({
  displayName: 'FormioImageList',
  render: function() {
    return <div>
      {
        this.props.files ? this.props.files.map((file, index) => {
          return (
            <span key={index}>
              <FormioImage file={file} formio={this.props.formio} width={this.props.width} />
              {(() => {
                if (!this.props.readOnly) {
                  return (
                    <span style={{width:'1%', 'white-space':'nowrap'}}><a onClick={this.props.removeFile.bind(null, index)} className='btn btn-sm btn-default'><span className='glyphicon glyphicon-remove'></span></a></span>
                  );
                }
              })()}
            </span>
          );
        }) : ''
      }
    </div>
  }
});

const FormioFile = React.createClass({
  displayName: 'FormioFile',
  getFile: function(event) {
    event.preventDefault();
    this.props.formio
       .downloadFile(this.props.file).then(file => {
        if (file) {
          window.open(file.url, '_blank');
        }
      })
      .catch(function(response) {
        // Is alert the best way to do this?
        // User is expecting an immediate notification due to attempting to download a file.
        alert(response);
      });
  },
  render: function() {
    return <a href={this.props.file.url} onClick={event => {this.getFile(event)}} target="_blank">{this.props.file.name}</a>;
  }
});

const FormioImage = React.createClass({
  displayName: 'FormioImage',
  getInitialState: function() {
    return {
      imageSrc: ''
    }
  },
  componentWillMount: function() {
    this.props.formio
      .downloadFile(this.props.file)
        .then(result => {
          this.setState({
            imageSrc: result.url
          });
        });
  },
  render: function() {
    return <img src={this.state.imageSrc} alt={this.props.file.name} style={{width: this.props.width}} />;
  }
});

module.exports = React.createClass({
  displayName: 'File',
  mixins: [valueMixin],
  getInitialValue: function() {
    return [];
  },
  componentWillMount: function() {
    this.setState({
      fileUploads: {}
    });
  },
  fileSelector: function() {
    if (!this.state.value.length > 0 || this.props.component.multiple) {
      return (
        <Dropzone onDrop={this.upload} multiple={this.props.component.multiple} className='formio-dropzone-default-content'>
          <div className='formio-content-centered'>
            <i id='formio-file-upload' className='glyphicon glyphicon-cloud-upload'></i>
            <span> Drop files to attach, or</span>
            <a style={{cursor: 'pointer'}}> browse</a><span>.</span>
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
        this.props.formio.uploadFile(this.props.component.storage, file, fileName, dir, (evt) => {
            this.setState((previousState) => {
              previousState.fileUploads[fileName].status = 'progress';
              previousState.fileUploads[fileName].progress = parseInt(100.0 * evt.loaded / evt.total);
              delete previousState.fileUploads[fileName].message;
              return previousState;
            });
          })
          .then((fileInfo) => {
            this.setState((previousState) => {
              delete previousState.fileUploads[fileName];
              return previousState;
            });
            this.setValue(fileInfo, this.state.value.length);
          })
          .catch((response) => {
            this.setState((previousState) => {
              previousState.fileUploads[fileName].status = 'error';
              previousState.fileUploads[fileName].message = response;
              delete previousState.fileUploads[fileName].progress;
              return previousState;
            });
          });
      });
    }
  },
  noStorageError: function() {
    return (
      <div className='formio-dropzone-error-content'>
        <span>No storage has been set for this field. File uploads are disabled until storage is set up.</span>
      </div>
    );
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
            <span onClick={this.removeUpload.bind(null, index)}><i className='glyphicon glyphicon-remove'/></span>
          </div>
          <div className='fileSize control-label col-sm-2 text-right'>
            { fileSize(fileUpload.size) }
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
  removeFile: function(id) {
    this.setState(function(previousState) {
      previousState.value.splice(id, 1);
      return previousState;
    });
  },
  removeUpload: function(name) {
    this.setState(function(previousState) {
      delete previousState.fileUploads[name];
      return previousState;
    });
  },
  fileList: function() {
    if (!this.props.component.image) {
      return <FormioFileList files={this.state.value} formio={this.props.formio} removeFile={this.removeFile} />
    }
    else {
      return <FormioImageList files={this.state.value} formio={this.props.formio} width={this.props.component.imageSize} removeFile={this.removeFile} />
    }
  },
  getElements: function() {
    var classLabel = 'control-label' + ( this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = (this.props.component.label && !this.props.component.hideLabel ?
      <label htmlFor={this.props.component.key} className={classLabel}>{this.props.component.label}</label> : '');
    var requiredInline = (!this.props.component.label && this.props.component.validate && this.props.component.validate.required ?
      <span className='glyphicon glyphicon-asterisk form-control-feedback field-required-inline' aria-hidden='true'></span> : '');

    return (
      <div className='formio-dropzone-margin'>
        {inputLabel} {requiredInline}
        {this.fileList()}
        {(() => {
          if (!this.props.readOnly) {
            return (
              <div>
                {this.fileSelector()}
                {this.props.component.storage ? null : this.noStorageError()}
                {Object.keys(this.state.fileUploads).map((key) => {
                  return this.fileUpload(this.state.fileUploads[key], key);
                })}
              </div>
            );
          }
        })()}
      </div>
    );
  },
  getValueDisplay: function(component, data) {
    let files = Array.isArray(data) ? data : [data];
    return (
      <FormioFileList files={files} readOnly={true} />
    )
  }
});
