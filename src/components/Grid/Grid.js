import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import GridHeaderForm from './Form/GridHeaderForm';
import GridBodyForm from './Form/GridBodyForm';
import GridFooterForm from './Form/GridFooterForm';

import * as styles from '../../styles/managerGrid.css';

export default class extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    header: PropTypes.object.isRequired,
    body: PropTypes.object.isRequired,
    footer: PropTypes.object.isRequired,
    onCreateNew: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowAction: PropTypes.func,
    onPage: PropTypes.func,
    onSort: PropTypes.func,
    firstItem: PropTypes.number,
    lastItem: PropTypes.number,
    total: PropTypes.number,
    activePage: PropTypes.number,
  };

  static defaultProps = {
    onSort: () => {},
    onClick: () => {},
    onPage: () => {},
    onCreateNew: () => {},
    onRowClick: () => {},
    onRowAction: () => {},
    header: {},
    body: {},
    footer: {},
    firstItem: 1,
    lastItem: 1,
    total: 1,
    activePage: 1,
  };

  render = () => {
    const {items, header, body, onSort, onRowClick, onRowAction} = this.props;
    const {footer, firstItem, lastItem, total, activePage, onPage, onCreateNew} = this.props;

    return (
      <div>
        { items.length ?
          <table className={'table table-bordered table-striped table-hover'}>
            <GridHeaderForm
              header={header}
              onSort={onSort}
            />
            <GridBodyForm
              body={body}
              items={items}
              onRowSelect={onRowClick}
              onRowAction={onRowAction}
            />
            <GridFooterForm
              footer={footer}
              onPage={onPage}
              onCreateNew={onCreateNew}
              activePage={activePage}
              firstItem={firstItem}
              lastItem={lastItem}
              total={total}
            />
          </table> :
          <div>No data found</div>
        }
      </div>
    );
  }
}
