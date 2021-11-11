import {Utils as FormioUtils} from 'formiojs';
import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';
import _isObject from 'lodash/isObject';
import _isString from 'lodash/isString';
import PropTypes from 'prop-types';
import React from 'react';

import {defaultPageSizes} from '../constants';
import {
  Columns,
  Operations,
  PageSizes,
} from '../types';
import {
  getComponentDefaultColumn,
  setColumnsWidth,
  stopPropagationWrapper,
} from '../utils';

import Grid from './Grid';

const SubmissionGrid = (props) => {
  const getSortQuery = (key, sort) => {
    const {
      submissions: {
        sort: currentSort,
      },
    } = props;

    const sortKey = _isString(sort) ? sort : key;
    const ascSort = sortKey;
    const descSort = `-${sortKey}`;
    const noSort = '';

    if (currentSort === ascSort) {
      return descSort;
    }
    else if (currentSort === descSort) {
      return noSort;
    }
    else {
      return ascSort;
    }
  };

  const onSort = ({
    key,
    sort,
  }) => {
    if (_isFunction(sort)) {
      return sort();
    }

    const {getSubmissions} = props;

    getSubmissions(1, {
      sort: getSortQuery(key, sort),
    });
  };

  const getColumns = (form) => {
    const columns = [];

    FormioUtils.eachComponent(form.components, (component) => {
      if (component.input && component.tableView && component.key) {
        columns.push(getComponentDefaultColumn(component));
      }
    });

    columns.push({
      key: 'operations',
      title: 'Operations',
    });

    setColumnsWidth(columns);

    return columns;
  };

  const Icon = ({icon}) => (
    <span>
      <i className={`fa fa-${icon}`} />&nbsp;
    </span>
  );

  const OperationButton = ({
    action,
    buttonType,
    icon,
    title,
    onAction,
    submission
  }) => (
    <span
      className={`btn btn-${buttonType} btn-sm form-btn`}
      onClick={stopPropagationWrapper(() => onAction(submission, action))}
    >
      {
        icon
          ? <Icon icon={icon}></Icon>
          : null
      }
      {title}
    </span>
  );

  const Cell = ({
    row: submission,
    column,
  }) => {
    const {
      form,
      onAction,
      operations,
    } = props;

    if (column.key === 'operations') {
      return (
        <div>
          {
            operations.map(({
              action,
              buttonType = 'primary',
              icon = '',
              permissionsResolver = () => true,
              title = '',
            }) =>
              permissionsResolver(form, submission)
                ? <OperationButton
                    key={action}
                    action={action}
                    buttonType={buttonType}
                    icon={icon}
                    title={title}
                    submission={submission}
                    onAction={onAction}
                  ></OperationButton>
                : null
            )
          }
        </div>
      );
    }

    const value = _isFunction(column.value)
      ? column.value(submission)
      : _get(submission, column.key, '');

    return (_isObject(value) && value.content)
      ? value.isHtml
        ? <div dangerouslySetInnerHTML={{__html: value.content}} />
        : <span>{String(value.content)}</span>
      : <span>{String(value)}</span>;
  };

  const {
    columns: propColumns,
    form,
    getSubmissions,
    onAction,
    onPageSizeChanged,
    pageSizes,
    submissions: {
      limit,
      pagination: {
        page,
        numPages,
        total,
      },
      sort,
      submissions,
    },
  } = props;

  const columns = propColumns.length ? propColumns : getColumns(form);
  const skip = (page - 1) * limit;
  const last = Math.min(skip + limit, total);

  return (
    <Grid
      Cell={Cell}
      activePage={page}
      columns={columns}
      emptyText="No data found"
      firstItem={skip + 1}
      items={submissions}
      lastItem={last}
      onAction={onAction}
      onPage={getSubmissions}
      onPageSizeChanged={onPageSizeChanged}
      onSort={onSort}
      pageSize={limit}
      pageSizes={pageSizes}
      pages={numPages}
      sortOrder={sort}
      total={total}
    />
  );
};

SubmissionGrid.propTypes = {
  columns: Columns,
  form: PropTypes.object.isRequired,
  getSubmissions: PropTypes.func,
  onAction: PropTypes.func,
  onPageSizeChanged: PropTypes.func,
  operations: Operations,
  pageSizes: PageSizes,
  submissions: PropTypes.object.isRequired,
};

SubmissionGrid.defaultProps = {
columns: [],
getSubmissions: () => {},
onAction: () => {},
onPageSizeChanged: () => {},
operations: [
  {
    action: 'view',
    buttonType: 'warning',
    icon: 'list-alt',
    permissionsResolver() {
      return true;
    },
    title: 'View',
  },
  {
    action: 'edit',
    buttonType: 'secondary',
    icon: 'edit',
    permissionsResolver() {
      return true;
    },
    title: 'Edit',
  },
  {
    action: 'delete',
    buttonType: 'danger',
    icon: 'trash',
    permissionsResolver() {
      return true;
    },
  },
],
pageSizes: defaultPageSizes,
};

export default SubmissionGrid;
