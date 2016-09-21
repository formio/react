import React from 'react';
import Pagify from 'react-pagify';
import segmentize from 'segmentize';

class Paginator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paginationPage: this.props.paginationPage,
      paginationNumPages: this.props.paginationNumPages
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.paginationPage !== this.props.paginationPage) {
      this.setState({
        paginationPage: nextProps.paginationPage
      });
    }
    if (nextProps.paginationNumPages !== this.props.paginationNumPages) {
      this.setState({
        paginationNumPages: nextProps.paginationNumPages
      });
    }
  }

  render() {
    const paginationPage = this.state.paginationPage;
    const paginationNumPages = this.state.paginationNumPages;
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
          tag: 'a',
        }
      }
    };
    return <div className="paging">
      <Pagify.Context
        {...bootstrapStyles}
        segments={segmentize({
        page: parseInt(paginationPage) + 1,
        pages: parseInt(paginationNumPages),
        beginPages: 3,
        endPages: 3,
        sidePages: 2
      })} onSelect={this.props.onSelect}
      >
        <Pagify.Button page={paginationPage - 1}>Previous</Pagify.Button>

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

        <Pagify.Button page={paginationPage + 1}>Next</Pagify.Button>
      </Pagify.Context>
    </div>;
  }
}

Paginator.propTypes = {
  paginationPage: React.PropTypes.number,
  paginationNumPages: React.PropTypes.number,
  onSelect: React.PropTypes.func
};

export default Paginator;