/**
* Internal dependencies
*/
import render_style from 'GetwidUtils/render-style';

const { convertHorizontalAlignToStyle, convertVerticalAlignToStyle } = render_style;

/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { InnerBlocks } = wp.blockEditor || wp.editor;
const { Component, Fragment, createContext } = wp.element;

const { Consumer, Provider } = createContext();

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
		const { slideId, outerParent } = this.props.attributes;

		let paddingTop, paddingBottom, paddingLeft, paddingRight, minHeight, horizontalAlign, verticalAlign, contentMaxWidth;

		if ( typeof outerParent.attributes != 'undefined' ) {

			let { attributes } = outerParent;

			paddingTop    	= attributes.paddingTop;
			paddingBottom 	= attributes.paddingBottom;
			paddingLeft   	= attributes.paddingLeft;
			paddingRight  	= attributes.paddingRight;
			minHeight 	  	= attributes.minHeight;
			horizontalAlign = attributes.horizontalAlign;
			verticalAlign   = attributes.verticalAlign;
			contentMaxWidth = attributes.contentMaxWidth;
		}

		let contentStyle = {};
		if ( typeof outerParent.attributes != 'undefined' ) {
			contentStyle = {
				paddingTop    : paddingTop    ? paddingTop    : null,
				paddingBottom : paddingBottom ? paddingBottom : null,
				paddingLeft   : paddingLeft   ? paddingLeft   : null,
				paddingRight  : paddingRight  ? paddingRight  : null,
				minHeight     : minHeight     ? minHeight     : null,
	
				justifyContent : horizontalAlign ? convertHorizontalAlignToStyle( horizontalAlign ) : null,
				alignItems     : verticalAlign   ? convertVerticalAlignToStyle  ( verticalAlign   ) : null
			}
		}

		let maxWidth;
		if ( typeof outerParent.attributes != 'undefined' ) {
			maxWidth = typeof outerParent != 'undefined' && typeof contentMaxWidth != 'undefined' ? contentMaxWidth : '80%';
		}

		const contentInnerWrapperStyle = {
            maxWidth: maxWidth ? maxWidth : null,
			width: '100%'
		};

		return (	
			<Fragment>
				<div className={`${className}__content-wrapper slide-${ slideId }`}>
					<div style={contentStyle} className={ `${className}__content` }>
						<div style={ contentInnerWrapperStyle }>
							<Provider value={this.props}>
								<InnerBlocks
									templateLock={'all'}
									template={TEMPLATE}
									templateInsertUpdatesSelection={false}
									allowedBlocks={ALLOWED_BLOCKS}
								/>
							</Provider>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Edit;

export { Consumer };