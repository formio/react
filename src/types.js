import PropTypes from 'prop-types';

export const AllItemsPerPage = 'all';

/**
 * @typedef Column
 * @type {object}
 * @property {string} key
 * @property {(boolean|string|Function)} sort
 * @property {string} title
 * @property {Function} value
 * @property {number} width
 */

/**
 * @constant
 * @type {Column}
 */
export const Column = PropTypes.shape({
	key: PropTypes.string.isRequired,
	sort: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.string,
		PropTypes.func,
	]),
	title: PropTypes.string,
	value: PropTypes.func,
	width: PropTypes.number,
});

/**
 * @constant
 * @type {Column[]}
 */
export const Columns = PropTypes.arrayOf(Column);

/**
 * @typedef Operation
 * @type {object}
 * @property {string} [action]
 * @property {string} [buttonType]
 * @property {string} [icon]
 * @property {Function} [permissionsResolver]
 * @property {string} [title]
 */

/**
 * @constant
 * @type {Operation}
 */
export const Operation = PropTypes.shape({
	action: PropTypes.string.isRequired,
	buttonType: PropTypes.string,
	icon: PropTypes.string,
	permissionsResolver: PropTypes.func,
	title: PropTypes.string,
});

/**
 * @constant
 * @type {Operation[]}
 */
export const Operations = PropTypes.arrayOf(Operation);

/**
 * @typedef LabelValue
 * @type {object}
 * @property {string} label
 * @property {number} value
 */

/**
 * @constant
 * @type {(number|LabelValue)}
 */
export const PageSize = PropTypes.oneOfType([
	PropTypes.number,
	PropTypes.shape({
		label: PropTypes.string,
		value: PropTypes.number,
	}),
	PropTypes.oneOf([AllItemsPerPage]),
]);

/**
 * @constant
 * @type {PageSize[]}
 */
export const PageSizes = PropTypes.arrayOf(PageSize);
