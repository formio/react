var React = require('react');
var DropzoneComponent = require('react-dropzone-component');
var ReactDOMServer = require('react-dom/server');

module.exports = React.createClass({
  displayName: 'File',
  getInitialState: function() {
    return {
      files: []
    };
  },
  fileUploadView: function(key,storageType, isMultiple, componentConfig, eventHandlers, djsConfig) {
    if (storageType) {
      if (!this.state.files.length > 0 || isMultiple) {
        return (
          <div>
            <DropzoneComponent config={componentConfig}
                               eventHandlers={eventHandlers}
                               djsConfig={djsConfig}/>
          </div>
        );
      }
    }
    else {
      return (
        <div key = {key} className='formio-dropzone-default-content' >
          {this.fileUploadInnerView()}
        </div>
      );
    }
  },
  fileUploadInnerView : function() {
    return (
      <div className='formio-content-centered'>
        <i id='formio-file-upload' className='glyphicon glyphicon-cloud-upload'></i>
        <span> Drop files to attach, or</span>
        <a href="#">  browse</a><span> .</span>
      </div>
    );
  },
  headercell : function(firstCell,secCell,thirdCell) {
    return (
      <tr>
        <th className="formio-dropzone-table">{firstCell}</th>
        <th >{secCell}</th>
        <th >{thirdCell}</th>
      </tr>
    );
  },
  noStorageError: function() {
    return (
      <div className='formio-dropzone-error-content'>
        <span>No storage has been set for this field. File uploads are disabled until storage is set up.</span>
      </div>
    );
  },
  removeRow: function(id) {
    var rows = this.state.files;
    rows.splice(id, 1);
    this.setState({
      files: rows
    });
  },
  configureTableCell: function(fileName,fileSize, id) {
    return (
      <tr id = {id} key={id}>
        <td  className="formio-dropzone-table"><span className='glyphicon glyphicon-remove' onClick={this.removeRow.bind(null, id)}> </span></td>
        <td><a href="#">{fileName}</a></td>
        <td>{fileSize}</td>
      </tr>
    );
  },
  render: function() {
    //To Do :- Remove _this
    var _this = this;
    var dropzoneObj;
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

    // To Do:- Need to add the params.
    var djsConfig = {
      addRemoveLinks: false,
      showFiletypeIcon: false,
      clickable: true,
      acceptedFiles: 'image/jpeg,image/png,image/gif, audio/*,video/*,.pdf,.txt',
      dictCancelUpload: null,
      dictRemoveFile: null,
      maxFilesize: 15,
      params:{},
      dictDefaultMessage:'<div class=\"formio-content-centered\"><i id=\"formio-file-upload\" class=\"glyphicon glyphicon-cloud-upload\"></i><span> Drop files to attach, or</span><a  href=\"#\">  browse</a><span> .</span></div>',
      previewTemplate: ReactDOMServer.renderToStaticMarkup(
        <div className="dz-preview dz-file-preview">
          <div className="dz-details">
            <div className="dz-filename"><span data-dz-name="true"></span><span className="dz-error-mark" data-dz-remove=""><span> ✘</span></span></div>
          </div>
          <div className="progress">
            <div className="progress-bar"  data-dz-uploadprogress="true" role="progressbar" aria-valuenow="70"
                 aria-valuemin="0" aria-valuemax="100" >
            </div>
          </div>
          <div className="dz-error-message"><span data-dz-errormessage="true"></span></div>
        </div>
      )
    };
    var eventHandlers = {
      init: initCallback,
      success: onDrop,
      complete: uploadComplete
    };

    tableClasses += ' table-striped';
    tableClasses += ' table-bordered';
    tableClasses +=  ' table-hover';
    tableClasses += ' table-condensed';
    tableClasses += 'formio-dropzone-margin';

    //To Do :- Need to use 'this' instead of '_this'
    function onDrop(file) {
      var test = _this.state.files;
      test.push(file);
      _this.setState({
        files: test
      });
    }

    function uploadComplete(file, progress) {
      if (file.status === 'success' && isMultiple) {
        dropzoneObj.removeFile(file);
      }
    }

    function initCallback(dropzone) {
      dropzoneObj = dropzone;
    }

    return (
      <div  className='formio-dropzone-margin' key ={key}>
        {title}
        <table className={tableClasses}>
          <thead>
          {this.headercell('', 'File Name', 'Size')}
          </thead>
          <tbody>
          {isMultiple ? this.configureTableCell('','NaN Bytes', 'multipleHeaderCell') : null}
          {this.state.files.length > 0 ?
            this.state.files.map((File, i) =>
              this.configureTableCell(File.name, File.size, i))
            : null}
          </tbody>
        </table>
        <div>
          {this.fileUploadView(key,storageType, isMultiple, componentConfig, eventHandlers, djsConfig)}
        </div>
        {storageType ? null : this.noStorageError()}
      </div>
    );
  }
});
