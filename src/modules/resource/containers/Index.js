import React from 'react';
import FormioView from '../../../FormioView';
import {Link} from 'react-router';
//import {FormioGrid} from '../../../components';
//import {FormActions, SubmissionActions} from '../../Formio/actions';

export default function (config) {
  return class extends FormioView {
    component = ({ form, submissions, pagination, limit, isFetching, onSortChange, onPageChange, onButtonClick }) => {
      if (isFetching) {
        return (
          <div className="form-index">
            Loading...
          </div>
        );
      }
      else {
        return (
          <div className="form-index">
            <h3>{form.title}s</h3>
            <Link className="btn btn-success" to={'/' + config.name + '/new'}>
              <i className="glyphicon glyphicon-plus" aria-hidden="true"></i>
              New {form.title}
            </Link>
            <br />
          </div>
        );
      }
    }
    /*<FormioGrid
     submissions={submissions}
     form={form}
     onSortChange={onSortChange}
     onPageChange={onPageChange}
     pagination={pagination}
     limit={limit}
     onButtonClick={onButtonClick}
     />*/

    initialize = ({dispatch}) => {
      dispatch(this.formio.resources[config.name].actions.form.get());
      //dispatch(this.formio.resources[config.name].actions.submission.index());
    }

    mapStateToProps = (state) => {
      const form = this.formio.resources[config.name].selectors.getForm(state);
      return {
        form: form.form,
        //submissions: root.submissions.submissions,
        //pagination: root.submissions.pagination,
        //limit: root.submissions.limit,
        //isFetching: root.submissions.isFetching
      };
    }

    mapDispatchToProps = (dispatch, ownProps, router) => {
      return {
        onSortChange: () => {
        },
        onPageChange: (page) => {
          dispatch(SubmissionActions.index(config.name, page));
        },
        onButtonClick: (button, id) => {
          switch (button) {
            case 'row':
            case 'view':
              router.transitionTo(config.basePath() + '/' + id);
              break;
            case 'edit':
              router.transitionTo(config.basePath() + '/' + id + '/edit');
              break;
            case 'delete':
              router.transitionTo(config.basePath() + '/' + id + '/delete');
              break;
          }
        }
      };
    }
  }
};