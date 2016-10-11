import React from 'react';
import Pagify from 'react-pagify';
import segmentize from 'segmentize';

class Paginator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: this.props.pagination
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pagination.page !== this.props.pagination.page) {
      this.setState({
        pagination: {
          page: nextProps.pagination.page
        }
      });
    }
    if (nextProps.pagination.numPages !== this.props.pagination.numPages) {
      this.setState({
        pagination: {
          numPages: nextProps.pagination.numPages
        }
      });
    }
  }

  render() {
    const pagination = this.state.pagination;
    const bootstrapStyles = {
      className: 'pagination',
      tags: {
        container: {
          tag: 'ul'
        },
        segment: {
          tag: 'li'
        },
        ellipsis: {
          tag: 'li',
          props: {
            className: 'disabled',
            children: React.createElement('span', null, '…')
          }
        },
        link: {
          tag: 'a'
        }
      }
    };
    const segments = _.clone(segmentize({
      page: parseInt(pagination.page) + 1,
      pages: parseInt(pagination.numPages),
      beginPages: 3,
      endPages: 3,
      sidePages: 2
    }));
    // Fixes a bug in Pagify.Segment or segmentize.
    segments.centerPage[0] = segments.centerPage[0] || 0;
    return <div className="paging">
      <Pagify.Context
        {...bootstrapStyles}
        segments={segments}
        onSelect={this.props.onSelect}
      >
        <Pagify.Button page={pagination.page - 1}>Previous</Pagify.Button>

        <Pagify.Segment field="beginPages" />

        <Pagify.Ellipsis
          className="ellipsis"
          previousField="beginPages"
          nextField="previousPages"
        />

        <Pagify.Segment field="previousPages" />
        <Pagify.Segment field="centerPage" />
        <Pagify.Segment field="nextPages" />

        <Pagify.Ellipsis
          className="ellipsis"
          previousField="nextPages"
          nextField="endPages"
        />

        <Pagify.Segment field="endPages" />

        <Pagify.Button page={pagination.page + 1}>Next</Pagify.Button>
      </Pagify.Context>
    </div>;
  }
}

Paginator.propTypes = {
  onSelect: React.PropTypes.func
};

export default Paginator;