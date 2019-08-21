/**
 * Internal dependencies
 */
import Inspector from './inspector';

import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import memize from 'memize';
import { isEqual, times } from 'lodash';

const { compose } = wp.compose;
const { PanelBody } = wp.components;
const { InspectorControls, PanelColorSettings, withColors, InnerBlocks, getColorClassName } = wp.editor;
const { Component, Fragment, createContext  } = wp.element;
const { select, dispatch } = wp.data;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [ 'getwid/vertical-timeline-item' ];

const getPanesTemplate = memize( count => (
	times( count, () => [ 'getwid/vertical-timeline-item' ] )
) );

const { Consumer, Provider } = createContext( {
	updateLineHeight: null
} );

/**
* Create an Component
*/
class GetwidTimeline extends Component {

	constructor() {
		super(...arguments);

		this.updateLineHeight = this.updateLineHeight.bind( this );
	}	

	render() {
		const { itemsCount } = this.props.attributes;
		const { className, baseClass } = this.props;

		const { textColor, backgroundColor } = this.props;
		const { setTextColor, setBackgroundColor } = this.props;	

		return (
			<Fragment>
				<Inspector {...this.props}/>
				<div className={`${className}`}>
					<div className={`${baseClass}__line`}></div>
					<Provider value={this.updateLineHeight}>
						<InnerBlocks
							templateInsertUpdatesSelection={false}
							allowedBlocks={ALLOWED_BLOCKS}
							template={getPanesTemplate( itemsCount )}
							templateLock={ false }
						/>
					</Provider>
				</div>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={ true }>
						<PanelColorSettings
							title={ __( 'Colors', 'getwid' ) }
							colorSettings={ [
								{
									value: textColor.color,
									onChange: setTextColor,
									label: __( 'Card Text Color', 'getwid' )
								},
								{
									value: backgroundColor.color,
									onChange: setBackgroundColor,
									label: __( 'Card Background Color', 'getwid' )
								}
							] }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		const { clientId, setAttributes } = this.props;

		const { getBlock } = select( 'core/editor' );
		const { updateBlockAttributes } = dispatch( 'core/editor' );

		const innerBlocks = getBlock( clientId ).innerBlocks;

		if ( ! isEqual( prevProps.itemsCount, innerBlocks.length ) ) {
			setAttributes( {
				itemsCount: innerBlocks.length
			} );
		}

		const { textColor, customTextColor } = this.props.attributes;
		const { backgroundColor, customBackgroundColor } = this.props.attributes;

		if ( innerBlocks.length ) {
			$.each( innerBlocks, (index, item) => {
				const firstColor = textColor ?
					{ textColor, customTextColor: undefined } :
					{ customTextColor, textColor: undefined };

				updateBlockAttributes( item.clientId, firstColor );

				const secondColor = backgroundColor ?
				{ backgroundColor, customBackgroundColor: undefined } :
				{ customBackgroundColor, backgroundColor: undefined };

				updateBlockAttributes( item.clientId, secondColor );
			} );
		}
	}

	updateLineHeight(removeLast) {
		const { clientId, setAttributes } = this.props;

		const $block = $( `#block-${clientId}` );
		const $points = removeLast ? $block.find( 'div[class$=__point]' ).not( ':last' ) : $block.find( 'div[class$=__point]' );

		let lineHeight = 0;
		$.each( $points, (index, point) => {
			if ( $points[ index + 1 ] ) {
				lineHeight += $( $points[ index + 1 ] ).offset().top - $( point ).offset().top;
			}
		} );

		const $line = $block.find( 'div[class$=__line]' );

		const wrapper = $block.find( 'div[class$=__wrapper]' )[ 0 ];
		const topOffset = parseFloat( $( wrapper ).css( 'height' ) ) / 2;

		$line.css( {
			height: lineHeight,
			top: topOffset
		} );

		if ( lineHeight && topOffset ) {
			setAttributes( {
				lineHeight, topOffset
			} );
		}		
	}

	componentDidMount() {
		/* */
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } )
] )( GetwidTimeline );

export { Consumer };