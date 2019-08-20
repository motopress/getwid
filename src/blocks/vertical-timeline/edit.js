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

		this.waitForLoadContent  = this.waitForLoadContent .bind( this );
		this.createItemsObserver = this.createItemsObserver.bind( this );
		this.updateLineHeight    = this.updateLineHeight   .bind( this );

		this.createItemsResizeObserver = this.createItemsResizeObserver.bind( this );
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

	updateLineHeight() {		
		const $block = $( `#block-${this.props.clientId}` );
		const $points = $block.find( 'div[class$=__point]' );

		let lineHeight = 0;
		$.each( $points, (index, point) => {
			if ( $points[ index + 1 ] ) {
				lineHeight += $( $points[ index + 1 ] ).offset().top - $( point ).offset().top;
			}
		} );

		const $line = $block.find( 'div[class$=__line]' );

		const wrapper = $block.find( 'div[class$=__wrapper]' )[ 0 ];
		const topOffset = parseFloat( $( wrapper ).css( 'height' ) );

		$line.css( {
			height: lineHeight,
			top: topOffset / 2
		} );
	}

	waitForLoadContent() {
		const that = this;
		that.waitLoadContent = setInterval( () => {
			if ( isEqual( document.readyState, 'complete' ) ) {

				that.updateLineHeight();

				that.createItemsObserver( that );
				that.createItemsResizeObserver( that );

				clearInterval( that.waitLoadContent );
			}
		}, 1 );
	}

	createItemsResizeObserver(that) {

		const $block = $( `#block-${this.props.clientId}` );
		const layout = $block.find( 'div[class$=__layout]' )[ 0 ];

		const $elements = $( layout ).children();

		that.resizers = {};
		$.each( $elements, (index, element) => {
			if ( $( element ).is( 'div[class$=__block]' ) ) {
				that.resizers[ `${element.id}` ] = new ResizeObserver( () => {
					that.updateLineHeight();
				} );
				that.resizers[ `${element.id}` ].observe( element );
			}
		} );
	}

	createItemsObserver(that) {
		const { baseClass } = this.props;

		const $block = $( `#block-${this.props.clientId}` );
		const $timeLine = $block.find( `.${baseClass}` );

		this.observer = new MutationObserver( mutations => {
			mutations.forEach( mutation => {
				if ( mutation.type == 'childList' ) {
					if ( mutation.addedNodes.length ) {
						const element = mutation.addedNodes[ 0 ];

						if ( $( element ).is( '.editor-block-list__block' ) ) {
							that.resizers[ `${element.id}` ] = new ResizeObserver( () => {
								that.updateLineHeight();
							} );
							that.resizers[ `${element.id}` ].observe( element );
							that.updateLineHeight();
						}
					}

					if ( mutation.removedNodes.length ) {
						const element = mutation.removedNodes[ 0 ];

						if ( $( element ).is( '.editor-block-list__block' ) ) {
							that.resizers[ `${element.id}` ].disconnect( element );
							delete that.resizers[ `${element.id}` ];
							that.updateLineHeight();
						}
					}					
				}
			} );
		} );

		this.observer.observe( $timeLine[ 0 ], {
			childList: true,
			subtree: true
		} );
	}

	componentDidMount() {
		$( window ).resize( () => {
			this.updateLineHeight();
		 } );

		this.waitForLoadContent();
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } )
] )( GetwidTimeline );

export { Consumer };