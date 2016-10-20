import React from 'react';
import { FormBuilder } from '../components';

export default class extends React.Component {
  static defaultProps = {
    form: {
      type: 'form'
    },
    onSave: () => null,
    onCancel: () => null
  }

  constructor(props) {
    super(props);

    this.state = {
      form: props.form
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.state.form !== nextProps.form) {
      this.setState({
        form: nextProps.form
      });
    }
  }

  render = () => {
    const { onSave, onCancel } = this.props;
    const { form } = this.state;
    const actionTitle = form._id ? 'Save Form' : 'Create Form';
    return (
      <form role="form">
        <div id="form-group-title" className="form-group">
          <label htmlFor="title" className="control-label">Title</label>
          <input type="text" value={ form.title } className="form-control" id="title" placeholder="Enter the form title"/>
        </div>
        <div id="form-group-name" className="form-group">
          <label htmlFor="name" className="control-label">Name</label>
          <input type="text" value={ form.name } className="form-control" id="name" placeholder="Enter the form machine name"/>
        </div>
        <div id="form-group-path" className="form-group">
          <label htmlFor="path" className="control-label">Path</label>
          <input type="text" className="form-control" id="path" value={ form.path } placeholder="example" style={{width: '200px', textTransform: 'lowercase'}} />
          <small>The path alias for this form.</small>
        </div>
        <FormBuilder src="formUrl"></FormBuilder>
        <div className="form-group pull-right">
          <a className="btn btn-default" onClick={() => {onCancel(form)}}>Cancel</a>
          <input type="submit" className="btn btn-primary" onClick={() => {onSave(form)}} value={actionTitle} />
        </div>
      </form>
    );
  }
}