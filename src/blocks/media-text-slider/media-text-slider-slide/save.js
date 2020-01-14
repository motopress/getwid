/**
* Internal dependencies
*/
import render_style from 'GetwidUtils/render-style';

const { convertHorizontalAlignToStyle, convertVerticalAlignToStyle } = render_style;

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { Component } = wp.element;
const { InnerBlocks } = wp.blockEditor || wp.editor;

/**
* Create an Component
*/
class Save extends Component {
	
	render() {
		const { baseClass } = this.props;
		const { slideId, outerParent } = this.props.attributes;

		let paddingTop, paddingBottom, paddingLeft, paddingRight, minHeight, horizontalAlign, verticalAlign, contentMaxWidth;

		if ( typeof outerParent.attributes != 'undefined' ) {

			const { attributes } = outerParent;

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

		let contentWrapperStyle = {}
		if ( typeof outerParent.attributes != 'undefined' ) {
			contentWrapperStyle = {
				minHeight : outerParent.attributes.minHeight ? outerParent.attributes.minHeight : null
			};
		}

		return (
			<div style={ contentWrapperStyle } className={ `${baseClass} ${baseClass}__content-wrapper slide-${ slideId }` }>
				<div style={ contentStyle } className={ `${baseClass}__content` }>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	}
}

export default ( Save );