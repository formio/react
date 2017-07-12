import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose, getContext} from 'recompose';

/*
 * formioConnect makes the formio object in context available to mapStateToProps and mapDispatchToProps.
 */
export default function formioConnect(...args) {
  return compose(
    getContext({formio: PropTypes.object}),
    getContext({router: PropTypes.object}),
    connect(...args)
  );
}
