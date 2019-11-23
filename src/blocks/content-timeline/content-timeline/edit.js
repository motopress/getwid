/**
 * Internal dependencies
 */
import Inspector from './inspector';

import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import { isEqual, get } from 'lodash';

const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { withColors, InnerBlocks, getColorObjectByAttributeValues } = wp.editor;
const { Component, Fragment, createContext } = wp.element;
const { IconButton } = wp.components;
const { createBlock } = wp.blocks;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [ 'getwid/content-timeline-item' ];

const { Consumer, Provider } = createContext( {
	updateLineHeight: null,
	updateBarHeight : null,
	setColorByScroll: null
} );

/**
* Create an Component
*/
class GetwidTimeline extends Component {

	constructor() {
		super(...arguments);

		this.updateLineHeight = this.updateLineHeight.bind( this );
		this.updateBarHeight  = this.updateBarHeight .bind( this );
		this.setColorByScroll = this.setColorByScroll.bind( this );
		this.changeState      = this.changeState     .bind( this );
		this.addItem          = this.addItem         .bind( this );

		this.state = {
			isLockedPaddings: false
		};
	}

	changeState (param, value) {
		this.setState( { [ param ]: value } );
	}

	getColor() {
		const { getEditorSettings } = this.props;
		const { fillColor, customFillColor } = this.props.attributes;

		if ( fillColor ) {
			const editorColors = get( getEditorSettings(), [ 'colors' ], [] );
			return getColorObjectByAttributeValues( editorColors, fillColor ).color;

		} else if ( customFillColor ) {
			return customFillColor;
		}
	}

	render() {
		const { changeState } = this;
		const { isLockedPaddings } = this.state;
		const { className, baseClass } = this.props;

		const color = this.getColor();
		const lineStyle = {
			style: {
				backgroundColor: color ? color : undefined
			}
		}

		return (
			<Fragment>
				<Inspector { ...{
					...this.props,
					...{ isLockedPaddings },
					...{ changeState }
				} } key={ 'inspector' } />
				<div className={`${className}`}>
					<div className={`${baseClass}__line`}>
						<div className={`${baseClass}__bar`} {...lineStyle}></div>
					</div>
					<Provider value={this}>
						<InnerBlocks
							templateInsertUpdatesSelection={false}
							allowedBlocks={ALLOWED_BLOCKS}
							template={ [
								[ 'getwid/content-timeline-item' ]
							] }
							templateLock={ false }

							/* #region if Gutenberg plugin activated */
							renderAppender={ () => (
								<div className={`${baseClass}__add-item`}>
									<IconButton
										icon={'insert'}
										onClick={this.addItem}
										label={__( 'Add Item', 'getwid' )}
									/>
								</div>
							) }
							/* #endregion */
						/>
					</Provider>
				</div>
			</Fragment>
		);
	}

	/* #region if Gutenberg plugin activated */
	addItem() {
		const { insertBlock, getBlock, clientId } = this.props;

		const insertedBlock = createBlock( 'getwid/content-timeline-item' );
		const innerBlocks   = getBlock( clientId ).innerBlocks;

		insertBlock( insertedBlock, innerBlocks.length, clientId );
	}
	/* #endregion */

	componentDidUpdate(prevProps, prevState) {
		const { clientId } = this.props;
		const { getBlock, updateBlockAttributes } = this.props;

		const innerBlocks = getBlock( clientId ).innerBlocks;

		const $block = $( `#block-${clientId}` );

		/* #region update inner blocks attributes */
		const { backgroundColor, customBackgroundColor } = this.props.attributes;
		const { paddingTop, paddingBottom, paddingLeft, paddingRight, animation } = this.props.attributes;
		const { horizontalSpace, marginBottom } = this.props.attributes;

		const pointColor = this.getColor();

		if ( innerBlocks.length ) {
			$.each( innerBlocks, (index, item) => {
				updateBlockAttributes( item.clientId, {
					outerParent: {
						attributes: {
							backgroundColor,
							customBackgroundColor,

							paddingTop,
							paddingBottom,
							paddingLeft,
							paddingRight,

							horizontalSpace,
							marginBottom,

							pointColor,
							animation
						}
					}
				} );
			} );
		}
		/* #endregion */

		/* #region update filling attribute */
		const { filling } = this.props.attributes;
		if ( ! isEqual( prevProps.attributes.filling, filling ) ) {

			const $root = $( '.edit-post-layout' ).find( 'div[class$=__content]' );

			if ( $.parseJSON( filling ) ) {
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

		/* #region update points color attribute */
		const { fillColor, customFillColor } = this.props.attributes;
		if ( ! isEqual( prevProps.attributes.fillColor, fillColor ) || ! isEqual( prevProps.attributes.customFillColor, customFillColor ) ) {

			const $points = $block.find( 'div[class$=__point]' );
			const borderColor = this.getColor();

			$.each( $points, (index, point) => {
				if ( $( point ).offset().top <= $( window ).height() / 2 ) {
					$( point ).find( ':first-child' ).css( {
						borderColor: borderColor ? borderColor : ''
					} );
				}
			} );
		}
		/* #endregion */
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
		const viewportHeightHalf = $( window ).height() / 2;

		const [ first, ...rest ] = $points.toArray();

		if ( ! first ) return;

		const barHeight = viewportHeightHalf - $( first ).offset().top;

		if ( rest.length ) {
			const last = rest.slice( -1 ).pop();
			const lastOffsetTop = $( last ).offset().top;

			if ( barOffsetTop <= viewportHeightHalf && lastOffsetTop >= viewportHeightHalf ) {
				$bar.css( { height: barHeight } );
			}

			if ( barOffsetTop >= viewportHeightHalf  ) {
				$bar.css( { height: 0 } );
			}

			if ( lastOffsetTop <= viewportHeightHalf ) {
				this.updateLineHeight();
				$bar.css( { height: '100%' } );
			}
		}
	}

	setColorByScroll($block) {
		const { baseClass } = this.props;
		const $points = $block.find( 'div[class$=__point]' );

		const [ first, ...rest ] = $points.get();
		if ( rest.length ) {
			$.each( $points, (index, point) => {

				const pointOffsetTop = $( point ).offset().top;
				const item = $( point ).parents( `.${baseClass}-item` )[ 0 ];

				const color = this.getColor();
				const pointHeightHalf = $( point ).height() / 2;

				if ( pointOffsetTop <= $( window ).height() / 2 + pointHeightHalf ) {
					if ( ! $( item ).hasClass( 'is-active' ) ) {
						$( item ).addClass( 'is-active' );
					}

					$( point ).find( ':first-child' ).css( {
						borderColor: color ? color : ''
					} );
				} else {
					if ( $( item ).hasClass( 'is-active' ) ) {
						$( item ).removeClass( 'is-active' );
					}

					$( point ).find( ':first-child' ).css( {
						borderColor: ''
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
		$bar.css( { height: 0 } );
	}

	componentDidMount() {

		const { clientId } = this.props;
		const $block = $( `#block-${clientId}` );

		const { filling } = this.props.attributes;

		if ( $.parseJSON( filling ) ) {
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

				const { filling } = this.props.attributes;
				if ( $.parseJSON( filling ) ) {

					this.setColorByScroll( $block );
					this.updateBarHeight ( $block );
				}

				/* #region mutation observer */
				this.mutationObserver = new MutationObserver( mutations => {
					$.each( mutations, (index, mutation) => {
						if ( mutation.type == 'childList' ) {

							if ( mutation.addedNodes.length || mutation.removedNodes.length ) {
								const item = mutation.addedNodes.length ? mutation.addedNodes[ 0 ] : mutation.removedNodes[ 0 ];

								const { getBlock, clientId } = this.props;

								if ( getBlock( clientId ).innerBlocks.length ) {
									if ( $( item ).is( 'div[class*=__block]' ) || $( item ).is( 'div[class*=__image-wrapper]' ) ) {
										this.updateLineHeight();
	
										const { filling } = this.props.attributes;
										if ( $.parseJSON( filling ) ) {
	
											this.setColorByScroll( $block );
											this.updateBarHeight ( $block );
										}
									}
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
		const { updateBlockAttributes, insertBlock } = dispatch( 'core/editor' );
		return {
			insertBlock,
			updateBlockAttributes
		};
	} ),
	withColors( 'fillColor', 'backgroundColor' )
] )( GetwidTimeline );

export { Consumer };
