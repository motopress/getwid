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
		const { id, outerParent } = this.props.attributes;

		const contentStyle = {
			paddingTop    : typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingTop    != 'undefined' ? outerParent.attributes.paddingTop    : null,
			paddingBottom : typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingBottom != 'undefined' ? outerParent.attributes.paddingBottom : null,
			paddingLeft   : typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingLeft   != 'undefined' ? outerParent.attributes.paddingLeft   : null,
			paddingRight  : typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingRight  != 'undefined' ? outerParent.attributes.paddingRight  : null,

			justifyContent : typeof outerParent != 'undefined' && typeof outerParent.attributes.horizontalAlign != 'undefined' ? convertHorizontalAlignToStyle( outerParent.attributes.horizontalAlign) : null,
			alignItems     : typeof outerParent != 'undefined' && typeof outerParent.attributes.verticalAlign   != 'undefined' ? convertVerticalAlignToStyle  ( outerParent.attributes.verticalAlign  ) : null,
		};

		const contentWrapperStyle = {
			minHeight : typeof outerParent != 'undefined' && typeof outerParent.attributes.minHeight != 'undefined' ? outerParent.attributes.minHeight : null
		};		

		return (
			<div style={ contentWrapperStyle } className={ `${baseClass} ${baseClass}__content-wrapper slide-${ id }` }>
				<div style={ contentStyle } className={ `${baseClass}__content` }>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	}
}

export default ( Save );