/**
* Internal dependencies
*/
import render_style from 'GetwidUtils/render-style';

const { convertHorizontalAlignToStyle, convertVerticalAlignToStyle } = render_style;

/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { InnerBlocks } = wp.editor;
const { Component, Fragment } = wp.element;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [ 'getwid/media-text-slider-slide-content' ];
const TEMPLATE = [
	[ 'getwid/media-text-slider-slide-content' ]
];

/**
* Create an Component
*/
class Edit extends Component {
	
	constructor() {
		super( ...arguments );
	}

	render() {
		const { className } = this.props;
		const { id, outerParent } = this.props.attributes;

		const { paddingTop, paddingBottom, paddingLeft, paddingRight, minHeight } = outerParent.attributes;
		const { horizontalAlign, verticalAlign, contentMaxWidth } = outerParent.attributes;
		
		const contentStyle = {
			paddingTop    : typeof outerParent != 'undefined' && typeof paddingTop    != 'undefined' ? paddingTop    : null,
			paddingBottom : typeof outerParent != 'undefined' && typeof paddingBottom != 'undefined' ? paddingBottom : null,
			paddingLeft   : typeof outerParent != 'undefined' && typeof paddingLeft   != 'undefined' ? paddingLeft   : null,
			paddingRight  : typeof outerParent != 'undefined' && typeof paddingRight  != 'undefined' ? paddingRight  : null,
			minHeight     : typeof outerParent != 'undefined' && typeof minHeight     != 'undefined' ? minHeight     : null,

			justifyContent : typeof outerParent != 'undefined' && typeof horizontalAlign != 'undefined' ? convertHorizontalAlignToStyle( horizontalAlign ) : null,
			alignItems     : typeof outerParent != 'undefined' && typeof verticalAlign   != 'undefined' ? convertVerticalAlignToStyle  ( verticalAlign   ) : null
		};

		const contentInnerWrapperStyle = {
            maxWidth : (typeof outerParent != 'undefined' && typeof contentMaxWidth != 'undefined' ? contentMaxWidth : '80%'),
			width: '100%'
		};

		return (	
			<Fragment>
				<div className={`${className}__content-wrapper slide-${ id }`}>
					<div style={contentStyle} className={ `${className}__content` }>
						<div style={ contentInnerWrapperStyle }>
							<InnerBlocks
								templateLock={ 'all' }
								template={ TEMPLATE }
								templateInsertUpdatesSelection={ false }
								allowedBlocks={ ALLOWED_BLOCKS }
							/>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default ( Edit );