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
const { withSelect, withDispatch } = wp.data;
const { PanelBody, CheckboxControl, SelectControl } = wp.components;
const { InspectorControls, PanelColorSettings, withColors, InnerBlocks, getColorClassName } = wp.editor;
const { Component, Fragment, createContext  } = wp.element;

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
		const { itemsCount, colorFilling, entranceAnimation } = this.props.attributes;

		const { className, baseClass, setAttributes } = this.props;
		const { backgroundColor, setBackgroundColor } = this.props;

		return (
			<Fragment>
				<Inspector {...this.props}/>
				<div className={`${className}`}>
					<div className={`${baseClass}__line`}>
						<div className={`${baseClass}__wrapper-bar`}>
							<div className={`${baseClass}__bar`}></div>
						</div>						
					</div>

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
						<SelectControl
							label={__( 'Animation Effect', 'getwid' )}
							value={entranceAnimation}
							onChange={ entranceAnimation => {
								setAttributes( { entranceAnimation } );
							}}
							options={ [
								{ value: 'none' , label: __( 'None' , 'getwid' ) },
								{ value: 'fadeInShort' , label: __( 'Bounce In Short' , 'getwid' ) }
							] }
						/>
						<PanelColorSettings
							title={ __( 'Colors', 'getwid' ) }
							colorSettings={ [
								{
									value: backgroundColor.color,
									onChange: setBackgroundColor,
									label: __( 'Card Background Color', 'getwid' )
								}
							] }
						/>
						<CheckboxControl
							label={__( 'Color animation', 'getwid' )}
							checked={colorFilling}
							onChange={ colorFilling => {
								setAttributes( { colorFilling } );
							} }
						/>
					</PanelBody>					
				</InspectorControls>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		const { clientId } = this.props;
		const { getBlock, updateBlockAttributes } = this.props;

		const innerBlocks = getBlock( clientId ).innerBlocks;

		if ( this.props.isSelected ) {
			this.colorPanelDisplayOn();
		}

		const { backgroundColor, customBackgroundColor, colorFilling, entranceAnimation } = this.props.attributes;

		if ( innerBlocks.length ) {
			$.each( innerBlocks, (index, item) => {
				updateBlockAttributes( item.clientId, {
					colorFilling,
					entranceAnimation,

					backgroundColor,
					customBackgroundColor
				} );
			} );
		}
	}

	colorPanelDisplayOn() {
		this.waitLoadPanel = setInterval( () => {

			const colorPanelSettings = $( '.editor-panel-color-settings' );
			if ( colorPanelSettings.length ) {
				colorPanelSettings.css( { display: 'block' } );

				clearInterval( this.waitLoadPanel );
			}
		}, 1 );
	}

	updateLineHeight(removeLast) {
		const { clientId } = this.props;

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
	}

	componentDidMount() {
		/* #region test */
		const { clientId } = this.props;

		const $block = $( `#block-${clientId}` );

		this.waitLoadMarkup = setInterval( () => {
			const $points = $block.find( 'div[class$=__point]' );
			if ( $points.length ) {

				const $root = $( '.edit-post-layout' ).find( 'div[class$=__content]' );

				$root.scroll( () => {
					$.each( $points, (index, point) => {
						const scrollTop = $( window ).scrollTop();
						const elementOffset = $( point ).offset().top;

						if ( elementOffset - scrollTop <= $( window ).height() / 2 ) {
							$( point ).find( ':first-child' ).css( {
								'border-color': '#11a7e7'
							} );
						} else {
							$( point ).find( ':first-child' ).css( {
								'border-color': '#dee3e6'
							} );
						}
					} );					
				});

				clearInterval( this.waitLoadMarkup );
			}
		}, 1 );		
		/* #endregion */
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getBlock } = select( 'core/editor' );
		return {
			getBlock
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		const { updateBlockAttributes } = dispatch( 'core/editor' );
		return {
			updateBlockAttributes
		};
	} ),
	withColors( 'backgroundColor', { textColor: 'color' } )
] )( GetwidTimeline );

export { Consumer };