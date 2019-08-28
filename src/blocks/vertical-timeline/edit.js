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
import { isEqual, times, get } from 'lodash';

const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { PanelBody, ToggleControl, SelectControl } = wp.components;
const { InspectorControls, PanelColorSettings, withColors, InnerBlocks, getColorObjectByAttributeValues } = wp.editor;
const { Component, Fragment } = wp.element;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [ 'getwid/vertical-timeline-item' ];

const getPanesTemplate = memize( count => (
	times( count, () => [ 'getwid/vertical-timeline-item' ] )
) );

/**
* Create an Component
*/
class GetwidTimeline extends Component {

	constructor() {
		super(...arguments);
	}

	getColor() {
		const { getEditorSettings } = this.props;
		const { lineColor, customLineColor } = this.props.attributes;

		if ( lineColor ) {
			const editorColors = get( getEditorSettings(), [ 'colors' ], [] );
			return getColorObjectByAttributeValues( editorColors, lineColor ).color;
			
		} else if ( customLineColor ) {
			return customLineColor;
		}
	}

	render() {
		const { itemsCount, enableFilling, entranceAnimation } = this.props.attributes;

		const { className, baseClass, setAttributes } = this.props;
		const { textColor, backgroundColor, setTextColor, setBackgroundColor, lineColor, setLineColor } = this.props;

		const color = this.getColor();
		const lineStyle = {
			style: {
				backgroundColor: color ? color : undefined
			}			
		}

		return (
			<Fragment>
				<Inspector {...this.props}/>
				<div className={`${className}`}>
					<div className={`${baseClass}__line`}>
						<div className={`${baseClass}__bar`} {...lineStyle}></div>
					</div>
					<InnerBlocks
						templateInsertUpdatesSelection={false}
						allowedBlocks={ALLOWED_BLOCKS}
						template={getPanesTemplate( itemsCount )}
						templateLock={ false }
					/>
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
									value: textColor.color,
									onChange: setTextColor,
									label: __( 'Card Text Color', 'getwid' )
								},
								{
									value: backgroundColor.color,
									onChange: setBackgroundColor,
									label: __( 'Card Background Color', 'getwid' )
								},
								{
									value: lineColor.color,
									onChange: setLineColor,
									label: __( 'Line Color', 'getwid' )
								}
							] }
						/>
						<ToggleControl
							label={__( 'Enable Filling', 'getwid' )}
							checked={enableFilling}
							onChange={ enableFilling => {
								setAttributes( { enableFilling } );
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

		/* #region update inner blocks attributes */
		const { backgroundColor, customBackgroundColor, entranceAnimation } = this.props.attributes;
		const { textColor, customTextColor } = this.props.attributes;

		if ( innerBlocks.length ) {
			$.each( innerBlocks, (index, item) => {
				updateBlockAttributes( item.clientId, {
					entranceAnimation,

					backgroundColor,
					customBackgroundColor,

					textColor,
					customTextColor
				} );
			} );
		}
		/* #endregion */

		const $block = $( `#block-${clientId}` );

		/* #region use filling */
		const { enableFilling } = this.props.attributes;
		if ( ! isEqual( prevProps.attributes.enableFilling, enableFilling ) ) {
			
			const $root = $( '.edit-post-layout' ).find( 'div[class$=__content]' );
						
			if ( enableFilling ) {
				const updateFilling = () => {
					this.setColorByScroll( $block );
					this.updateBarHeight ( $block );
				}

				updateFilling();

				$root.scroll( () => {
					updateFilling();
				} );
			} else {
				$root.off();
				this.disableFilling( $block );
			}
		}
		/* #endregion */

		/* #region update points color */
		const { lineColor, customLineColor } = this.props.attributes;
		if ( ! isEqual( prevProps.attributes.lineColor, lineColor ) || ! isEqual( prevProps.attributes.customLineColor, customLineColor ) ) {

			const $points = $block.find( 'div[class$=__point]' );
			const color = this.getColor();

			$.each( $points, (index, point) => {
				if ( $( point ).offset().top <= $( window ).height() / 2 ) {
					$( point ).find( ':first-child' ).css( {
						borderColor: color ? color : '#11a7e7'
					} );
				}
			} );
		}
		/* #endregion */
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

	updateLineHeight() {
		const { clientId } = this.props;

		const $block = $( `#block-${clientId}` );
		const $points = $block.find( 'div[class$=__point]' );

		let lineHeight = 0;
		$.each( $points, (index, point) => {
			if ( $points[ index + 1 ] ) {
				lineHeight += $( $points[ index + 1 ] ).offset().top - $( point ).offset().top;
			}
		} );

		const $line = $block.find( 'div[class$=__line]' );

		const wrapper = $block.find( 'div[class*=__wrapper]' )[ 0 ];
		const topOffset = parseFloat( $( wrapper ).css( 'height' ) ) / 2;

		$line.css( {
			height: lineHeight,
			top: topOffset
		} );
	}

	updateBarHeight($block) {

		const $points = $block.find( 'div[class$=__point]' );
		const $bar    = $block.find( 'div[class$=__bar]'   );

		const barOffsetTop = $bar.offset().top;

		const [ first, ...rest ] = $points.toArray();
		const barHeight = $( window ).height() / 2 - $( first ).offset().top;

		if ( rest.length ) {
			const last = rest.slice( -1 ).pop();
			const lastOffsetTop = $( last ).offset().top;

			if ( barOffsetTop <= $( window ).height() / 2 && lastOffsetTop >= $( window ).height() / 2 ) {
				$bar.css( { height: barHeight } );
			}
	
			if ( barOffsetTop >= $( window ).height() / 2  ) {
				$bar.css( { height: 0 } );
			}
	
			if ( lastOffsetTop <= $( window ).height() / 2 ) {
				$bar.css( { height: '100%' } );
			}
		}
	}

	setColorByScroll($block) {
		const $points = $block.find( 'div[class$=__point]' );

		const [ first, ...rest ] = $points.get();
		if ( rest.length ) {
			$.each( $points, (index, point) => {
				const pointOffsetTop = $( point ).offset().top;
	
				const color = this.getColor();
				if ( pointOffsetTop <= $( window ).height() / 2 ) {
					$( point ).find( ':first-child' ).css( {
						borderColor: color ? color : '#11a7e7'
					} );
				} else {
					$( point ).find( ':first-child' ).css( {
						borderColor: '#dee3e6'
					} );
				}
			} );
		}

		if ( ! rest.length ) {
			this.disableFilling( $block );
		}
	}

	disableFilling($block) {
		const $bar    = $block.find( 'div[class$=__bar]'   );
		const $points = $block.find( 'div[class$=__point]' );

		$.each( $points, (index, point) => {
			$( point ).find( ':first-child' ).css( {
				borderColor: '#dee3e6'
			} );
		} );

		$bar.css( { height: 0 } );
	}

	componentDidMount() {
		const { clientId } = this.props;
		const $block = $( `#block-${clientId}` );

		const { enableFilling } = this.props.attributes;

		if ( enableFilling ) {
			this.waitLoadMarkup = setInterval( () => {
				const $wrappers = $block.find( 'div[class*=__wrapper]' );
				
				if ( $wrappers.length ) {
					const $root = $( '.edit-post-layout' ).find( 'div[class$=__content]' );

					$root.scroll( () => {
						this.setColorByScroll( $block );
						this.updateBarHeight ( $block );
					});
	
					clearInterval( this.waitLoadMarkup );
				}
			}, 1 );
		}
		
		this.waitLoadContent = setInterval( () => {
			if ( document.readyState == 'complete' ) {
				this.updateLineHeight();

				const { className } = this.props;
				const $timeLine = $block.find( `.${className}` );

				/* #region resize observer */
				this.resizeObserver = new ResizeObserver( () => {
					this.updateLineHeight();

					const { enableFilling } = this.props.attributes;
					if ( enableFilling ) {

						this.setColorByScroll( $block );
						this.updateBarHeight ( $block );
					}
				} );

				this.resizeObserver.observe( $timeLine.get( 0 ) );
				/* #endregion */

				/* #region mutation observer */
				this.mutationObserver = new MutationObserver( mutations => {
					$.each( mutations, (index, mutation) => {
						if ( mutation.type == 'childList' ) {

							if ( mutation.addedNodes.length ) {
								this.updateLineHeight();

								const { enableFilling } = this.props.attributes;
								if ( enableFilling ) {

									this.setColorByScroll( $block );
									this.updateBarHeight ( $block );
								}
							}
						}
				} ) } );
		
				this.mutationObserver.observe( $timeLine.get( 0 ), {
					childList: true,
					subtree: true
				} );
				/* #endregion */
				
				clearInterval( this.waitLoadContent );
			}
		}, 1 );
	}

	componentWillUnmount() {
		const { className, clientId } = this.props;

		const $block = $( `#block-${clientId}` );
		const $timeLine = $block.find( `.${className}` );

		this.resizeObserver  .unobserve ( $timeLine.get( 0 ) );
		this.mutationObserver.disconnect( $timeLine.get( 0 ) );

		const $root = $( '.edit-post-layout' ).find( 'div[class$=__content]' );
		$root.off();
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getBlock, getEditorSettings } = select( 'core/editor' );
		return {
			getEditorSettings,
			getBlock
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		const { updateBlockAttributes } = dispatch( 'core/editor' );
		return {
			updateBlockAttributes
		};
	} ),
	withColors( 'lineColor', 'backgroundColor', { textColor: 'color' } )
] )( GetwidTimeline );