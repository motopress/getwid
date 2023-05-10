/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import memize from 'memize';

import classnames from 'classnames';
import { times, isEqual, isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import Inspector from './inspector';

import './editor.scss';

/**
* WordPress dependencies
*/
const { Button } = wp.components;
const { Component, Fragment, createContext } = wp.element;
const { InnerBlocks, RichText } = wp.blockEditor || wp.editor;

const { jQuery: $ } = window;

/**
* Module Constants
*/
const { Consumer, Provider } = createContext();

const ALLOWED_BLOCKS = [ 'getwid/media-text-slider-slide' ];

const getPanesTemplate = memize( panes => (
	times( panes, index => [ 'getwid/media-text-slider-slide', { slideId: ++index } ] )
) );

const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color'
];

/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.changeState = this.changeState.bind( this );
		this.addNewSlide = this.addNewSlide.bind( this );
		this.getState 	 = this.getState   .bind( this );

		this.updateContentAttributes  = this.updateContentAttributes .bind( this );
		this.setInnerBlocksAttributes = this.setInnerBlocksAttributes.bind( this );

		this.state = {
			currentSlide: 1,
			selectedSlide: 0,
			isLockedPaddings: false
		};
	}

	changeState (param, value) {
		this.setState( { [ param ]: value } );
	}

	getState (value) {
		return this.state[ value ];
	}

	setInnerBlocksAttributes(callFrom = 'mount', prevProps, prevState) {

		const { select, dispatch } = window.wp.data;

		const { paddingRight, textColor, overlayColor, overlayOpacity, imageSize } = this.props.attributes;
		const { contentMaxWidth, minHeight, verticalAlign, horizontalAlign, paddingTop, paddingBottom, paddingLeft } = this.props.attributes;

		const InnerBlocksProps = {
			attributes: {
				contentMaxWidth,
				minHeight,
				verticalAlign,
				horizontalAlign,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				textColor,
				overlayColor,
				overlayOpacity,
				imageSize
			}
		};

		if ( callFrom == 'Update' ) {
			if ( isEqual(this.props.attributes, prevProps.attributes ) ) {
				return;
			}
		}

		const { getBlock } = select( 'core/block-editor' );
		const block = getBlock( this.props.clientId );

		let innerBlocksOuter;
		if ( block ) {
			innerBlocksOuter = block.innerBlocks;
		}

		if ( innerBlocksOuter ) {
			if ( innerBlocksOuter.length ) {
				jQuery.each( innerBlocksOuter, (index, item) => {

					if ( ( callFrom == 'Mount' && isEmpty(item.attributes.outerParent)) || callFrom == 'Update' ) {

						//Inner blocks
						dispatch( 'core/block-editor' ).updateBlockAttributes( item.clientId, { outerParent: InnerBlocksProps } );

						//Inner -> Inner blocks
						if ( typeof item.clientId != 'undefined' && item.innerBlocks.length ) {
							dispatch( 'core/block-editor' ).updateBlockAttributes( item.innerBlocks[ 0 ].clientId, { innerParent: InnerBlocksProps } );
						}
					}
				} );
			}
		}
	}

	updateContentAttributes(contentBlockId) {

		const { dispatch, select } = window.wp.data;
		const { clientId } = this.props;

		const innerBlocksOuter = select( 'core/block-editor' ).getBlock( clientId ).innerBlocks;

		const { contentMaxWidth, minHeight, textColor, overlayColor, overlayOpacity, imageSize } = this.props.attributes;
		const { verticalAlign, horizontalAlign, paddingTop, paddingBottom, paddingLeft, paddingRight, } = this.props.attributes;

		const InnerBlocksProps = {
			attributes: {
				contentMaxWidth,
				minHeight,
				verticalAlign,
				horizontalAlign,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				textColor,
				overlayColor,
				overlayOpacity,
				imageSize
			}
		};

		$.each( innerBlocksOuter, (index, item) => {
			if ( !!item.innerBlocks[ 0 ] && isEqual( contentBlockId, item.innerBlocks[ 0 ].clientId ) ) {
				dispatch( 'core/block-editor' ).updateBlockAttributes( contentBlockId, { innerParent: InnerBlocksProps } );
			}
		} );
	}

	addNewSlide(nextSlide) {

		const { setAttributes } = this.props;
		const { sliderArrays } = this.props.attributes;

		const slides = JSON.parse( sliderArrays );
		const { changeState, getState } = this;

		if ( slides.length < nextSlide ) {
			const amount = Math.abs( nextSlide - slides.length );

			times(amount, index => {
				const slideNumber = nextSlide - index;

				slides.push(
					//translators: %d is a counter 1, 2, 3
					sprintf( __( 'Slide %d', 'getwid' ), slideNumber )
				);
			});

			setAttributes({
				sliderArrays: JSON.stringify( slides ),
				slideCount: nextSlide
			});
		} else {
			if ( nextSlide - 1 < getState( 'selectedSlide' ) ) {
				changeState( 'selectedSlide', nextSlide - 1 );
				changeState( 'currentSlide', nextSlide );
			}

			setAttributes({
				sliderArrays: JSON.stringify( slides.slice( 0, nextSlide ) ),
				slideCount: nextSlide
			});
		}
	}

	componentDidMount() {
		const { setAttributes } = this.props;
		const { sliderArrows, sliderDots } = this.props.attributes;

		if (!sliderArrows || !sliderDots){
			setAttributes( {
				sliderArrows: 'outside',
				sliderDots: 'outside'
			});
		}
		this.setInnerBlocksAttributes( 'Mount' );
	}

	componentDidUpdate(prevProps, prevState) {
		this.setInnerBlocksAttributes( 'Update', prevProps, prevState );
	}

	render() {

		const { changeState, getState } = this;
		const { slideCount, align, sliderArrays } = this.props.attributes;
		const { className, baseClass } = this.props;

		const sliderArraysParsed = JSON.parse( sliderArrays );

		const wrapperClass = classnames( className, {
			[ `${baseClass}--current-slide-${getState( 'currentSlide' )}` ]: true,
			'alignfull': align === 'full',
			'alignwide': align === 'wide'
		});

		const updateSlideLabel = ( value, index ) => {

			const { setAttributes } = this.props;
			const sliderArraysParsed = JSON.parse( sliderArrays );

			sliderArraysParsed[ index ] = value;

			setAttributes( {
				sliderArrays: JSON.stringify( sliderArraysParsed )
			} );
		};

		const renderEditTitles = index => {
			if ( typeof sliderArraysParsed[ index ] !== 'undefined' ) {
				const titleClass = classnames( {
					[`${ baseClass }__title-wrapper`]: true,
					[`${ baseClass }__title-wrapper-${ index }`]: true,
					[`${baseClass}__title-wrapper--active`]: 1 + index === getState( 'currentSlide' ),
					[`${baseClass}__title-wrapper--inactive`]: 1 + index !== getState( 'currentSlide' ),
				} );

				return (
					<li
						key={ index }
						className={ titleClass }
					>
						<span
							className={ `${baseClass}__title ${baseClass}__title-${ 1 + index }` }
							onClick={ () => {
								changeState( 'currentSlide' , 1 + index );
								changeState( 'selectedSlide', index     );
							} }
						>
							<RichText
								tagName='div'
								className={`${baseClass}__title_text`}
								placeholder={ __( 'Slide', 'getwid' ) }
								value={ sliderArraysParsed[ index ] ? typeof sliderArraysParsed[ index ].text !== 'undefined' ? sliderArraysParsed[ index ].text : sliderArraysParsed[ index ] : __( 'Slide', 'getwid' ) }
								unstableOnFocus={() => changeState( 'currentSlide', 1 + index )}
								onChange={value => {
									updateSlideLabel( value, index );
								}}
								allowedFormats={allowedFormats}
							/>
						</span>
					</li>
				);
			}
		};

		const { addNewSlide } = this;
		const { isLockedPaddings } = this.state;

		return (
			<Fragment>
				<Inspector
					{ ...{
						...this.props,
						isLockedPaddings,
						changeState,
						addNewSlide,
						getState
					} }
				/>

				<div className={wrapperClass}>
					<div className={`${baseClass}__slides-wrapper`}>
						<ul className={`${baseClass}__titles`}>
							<Fragment>
								{times( slideCount, index => renderEditTitles( index ) )}
								<li className={`${baseClass}__add-item`}>
									<Button
										icon='insert'
										onClick={() => addNewSlide( slideCount + 1 )}
										label={__( 'Add Item', 'getwid' )}
									/>
								</li>
							</Fragment>
						</ul>
						<div className={`${baseClass}__content`}>
							<Provider value={this}>
								<InnerBlocks
									template={getPanesTemplate( slideCount )}
									templateLock='all'
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
