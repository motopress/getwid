const attributes = {
	align: {
		type: 'string'
	},
	active: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-accordion',
		attribute: 'data-active-element',
		default: '0'
	},
	iconPosition: {
		type: 'string',
		default: 'left'
	},
	iconOpen: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-accordion__icon.is-passive i',
		attribute: 'class',
		default: 'fas fa-minus'
	},
	iconClose: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-accordion__icon.is-active i',
		attribute: 'class',
		default: 'fas fa-plus'
	},
	headerTag: {
		type: 'string',
		default: 'span'
	},













	// wrapperAlign: {
	// 	type: 'string'
	// },

	/* #region colors */
	// backgroundColor: {
	// 	type: 'string'
	// },
	// customBackgroundColor: {
	// 	type: 'string'
	// },
	// fillColor: {
	// 	type: 'string'
	// },
	// customFillColor: {
	// 	type: 'string'
	// },
	/* #endregion */

	/* #region paddings */
	// paddingTop: {
	// 	type: 'string'
	// },
	// paddingBottom: {
	// 	type: 'string'
	// },
	// paddingLeft: {
	// 	type: 'string'
	// },
	// paddingRight: {
	// 	type: 'string'
	// },
	/* #endregion */

	/* #region margins */
	// horizontalSpace: {
	// 	type: 'string'
	// },
	// marginBottom: {
	// 	type: 'string'
	// },
	/* #endregion */

	// animation: {
	// 	type: 'string',
	// 	source: 'attribute',
	// 	selector: '.wp-block-getwid-content-timeline',
	// 	attribute: 'data-animation',
	// 	default: 'none'
	// },
	// filling: {
	// 	type: 'string',
	// 	source: 'attribute',
	// 	selector: '.wp-block-getwid-content-timeline',
	// 	attribute: 'data-filling',
	// 	default: 'true'
	// }
};

export default attributes;