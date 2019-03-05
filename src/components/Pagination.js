import React, {Component} from 'react';
import PropTypes from 'prop-types';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

export default class extends Component {
  static propTypes = {
    pages: PropTypes.number.isRequired,
    pageNeighbours: PropTypes.number,
    activePage: PropTypes.number,
    prev: PropTypes.string,
    next: PropTypes.string,
    onSelect: PropTypes.func.isRequired
  };

  static defaultProps = {
    pages: 1,
    pageNeighbours: 1,
    activePage: 1,
    prev: 'Previous',
    next: 'Next',
    onSelect: () => {}
  };

  range = (from, to, step = 1) => {
    let i = from;
    const range = [];

    while (i <= to) {
      range.push(i);
      i += step;
    }

    return range;
  };

  getPageNumbers = () => {
    const {activePage, pageNeighbours} = this.props;

    const totalPages = this.props.pages;
    const currentPage = activePage;
    const totalNumbers = (pageNeighbours * 2) + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

      let pages = this.range(startPage, endPage);

      const hasLeftSpill = startPage > 2;
      const hasRightSpill = (totalPages - endPage) > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        case (hasLeftSpill && !hasRightSpill): {
          const extraPages = this.range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        case (!hasLeftSpill && hasRightSpill): {
          const extraPages = this.range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        case (hasLeftSpill && hasRightSpill):
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }

      return [1, ...pages, totalPages];
    }

    return this.range(1, totalPages);
  };

  render = () => {
    const {activePage, prev, next, onSelect, pages} = this.props;
    const pageNumbers = this.getPageNumbers();

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">

          <li className={`page-item ${activePage === 1 ? 'disabled' : ''}`}>
            <a
              className="page-link"
              onClick={() => {
                activePage !== 1 ? onSelect(activePage-1) : null;
              }}
              href="#">
              {prev}
            </a>
          </li>

          {pageNumbers.map( (page, pageNumber) => {
            const className = page === activePage ? 'active' : '';

            if (page === LEFT_PAGE) {
              return (
                <li className="page-item disabled">
                  <a className="page-link" href="#">
                      <span aria-hidden="true">...</span>
                  </a>
                </li>
              );
            }

            if (page === RIGHT_PAGE) {
              return (
                <li className="page-item disabled">
                  <a className="page-link" href="#">
                      <span aria-hidden="true">...</span>
                  </a>
                </li>
              );
            }

            return (
              <li className={'page-item ' + className} key={pageNumber}>
                <a
                  className="page-link"
                  onClick={() => onSelect(page)}
                  href="#">
                  {page}
                </a>
              </li>
            );
          })}

          <li className={`page-item ${activePage === pages ? 'disabled' : ''}`}>
            <a
              className="page-link"
              onClick={() => {
                activePage !== pages ? onSelect(activePage+1) : null;
              }}
              href="#">
              {next}
            </a>
          </li>

        </ul>
      </nav>
    );
  }
}
