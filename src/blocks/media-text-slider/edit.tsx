import {
	InnerBlocks,
	RichText,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { createContext, useEffect, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import { baseClass, getParentAttributes, parseSliderLabels } from './utils';
import type {
	MediaTextSliderContextValue,
	MediaTextSliderEditProps,
} from './types';

import './editor.scss';

export const MediaTextSliderContext =
	createContext< MediaTextSliderContextValue >( {
		updateContentAttributes: () => undefined,
	} );

const allowedBlocks = [ 'getwid/media-text-slider-slide' ];
const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

function getPanesTemplate( panes: number ) {
	return Array.from( { length: panes }, ( _item, index ) => [
		'getwid/media-text-slider-slide',
		{ slideId: index + 1 },
	] );
}

export default function Edit( props: MediaTextSliderEditProps ) {
	const { attributes, setAttributes, clientId, className } = props;
	const [ currentSlide, setCurrentSlide ] = useState( 1 );
	const [ selectedSlide, setSelectedSlide ] = useState( 0 );
	const [ isLockedPaddings, setIsLockedPaddings ] = useState( false );
	const { slideCount, align, sliderArrays } = attributes;
	const sliderLabels = parseSliderLabels( sliderArrays );
	const block = useSelect(
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);
	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const parentAttributes = getParentAttributes( attributes );
	const blockProps = useBlockProps( {
		className: clsx( className, {
			[ `${ baseClass }--current-slide-${ currentSlide }` ]: true,
			alignfull: align === 'full',
			alignwide: align === 'wide',
		} ),
	} );

	useEffect( () => {
		if ( ! attributes.sliderArrows || ! attributes.sliderDots ) {
			setAttributes( {
				sliderArrows: 'outside',
				sliderDots: 'outside',
			} );
		}
	}, [] );

	useEffect( () => {
		block?.innerBlocks.forEach( ( slide ) => {
			updateBlockAttributes( slide.clientId, {
				outerParent: parentAttributes,
			} );

			const contentBlock = slide.innerBlocks[ 0 ];
			if ( contentBlock ) {
				updateBlockAttributes( contentBlock.clientId, {
					innerParent: parentAttributes,
				} );
			}
		} );
	}, [
		block?.innerBlocks,
		parentAttributes.attributes.contentMaxWidth,
		parentAttributes.attributes.horizontalAlign,
		parentAttributes.attributes.imageSize,
		parentAttributes.attributes.minHeight,
		parentAttributes.attributes.overlayColor,
		parentAttributes.attributes.overlayOpacity,
		parentAttributes.attributes.paddingBottom,
		parentAttributes.attributes.paddingLeft,
		parentAttributes.attributes.paddingRight,
		parentAttributes.attributes.paddingTop,
		parentAttributes.attributes.textColor,
		parentAttributes.attributes.verticalAlign,
		updateBlockAttributes,
	] );

	function addNewSlide( nextSlide: number ) {
		const slides = [ ...sliderLabels ];

		if ( slides.length < nextSlide ) {
			const amount = Math.abs( nextSlide - slides.length );

			Array.from( { length: amount }, ( _item, index ) => {
				const slideNumber = nextSlide - index;

				slides.push(
					sprintf(
						/* translators: %d is a counter 1, 2, 3. */
						__( 'Slide %d', 'getwid' ),
						slideNumber
					)
				);
			} );
		}

		if ( nextSlide - 1 < selectedSlide ) {
			setSelectedSlide( nextSlide - 1 );
			setCurrentSlide( nextSlide );
		}

		setAttributes( {
			sliderArrays: JSON.stringify( slides.slice( 0, nextSlide ) ),
			slideCount: nextSlide,
		} );
	}

	function updateContentAttributes( contentBlockId: string ) {
		block?.innerBlocks.forEach( ( slide ) => {
			if ( slide.innerBlocks[ 0 ]?.clientId === contentBlockId ) {
				updateBlockAttributes( contentBlockId, {
					innerParent: parentAttributes,
				} );
			}
		} );
	}

	function updateSlideLabel( value: string, index: number ) {
		const nextLabels = [ ...sliderLabels ];
		nextLabels[ index ] = value;
		setAttributes( { sliderArrays: JSON.stringify( nextLabels ) } );
	}

	return (
		<>
			<Inspector
				{ ...props }
				addNewSlide={ addNewSlide }
				isLockedPaddings={ isLockedPaddings }
				onChangePaddingsLock={ setIsLockedPaddings }
			/>
			<div { ...blockProps }>
				<div className={ `${ baseClass }__slides-wrapper` }>
					<ul className={ `${ baseClass }__titles` }>
						{ Array.from(
							{ length: slideCount },
							( _item, index ) => (
								<li
									key={ index }
									className={ clsx(
										`${ baseClass }__title-wrapper`,
										`${ baseClass }__title-wrapper-${ index }`,
										{
											[ `${ baseClass }__title-wrapper--active` ]:
												index + 1 === currentSlide,
											[ `${ baseClass }__title-wrapper--inactive` ]:
												index + 1 !== currentSlide,
										}
									) }
								>
									<span
										className={ `${ baseClass }__title ${ baseClass }__title-${
											index + 1
										}` }
										onClick={ () => {
											setCurrentSlide( index + 1 );
											setSelectedSlide( index );
										} }
										onKeyDown={ ( event ) => {
											if (
												event.key === 'Enter' ||
												event.key === ' '
											) {
												setCurrentSlide( index + 1 );
												setSelectedSlide( index );
											}
										} }
										role="button"
										tabIndex={ 0 }
									>
										<RichText
											tagName="div"
											className={ `${ baseClass }__title_text` }
											placeholder={ __(
												'Slide',
												'getwid'
											) }
											value={
												sliderLabels[ index ] ||
												__( 'Slide', 'getwid' )
											}
											onFocus={ () =>
												setCurrentSlide( index + 1 )
											}
											onChange={ ( value ) =>
												updateSlideLabel( value, index )
											}
											allowedFormats={ allowedFormats }
										/>
									</span>
								</li>
							)
						) }
						<li className={ `${ baseClass }__add-item` }>
							<Button
								icon="insert"
								onClick={ () => addNewSlide( slideCount + 1 ) }
								label={ __( 'Add Item', 'getwid' ) }
							/>
						</li>
					</ul>
					<div className={ `${ baseClass }__content` }>
						<MediaTextSliderContext.Provider
							value={ { updateContentAttributes } }
						>
							<InnerBlocks
								template={ getPanesTemplate( slideCount ) }
								templateLock="all"
								templateInsertUpdatesSelection={ false }
								allowedBlocks={ allowedBlocks }
							/>
						</MediaTextSliderContext.Provider>
					</div>
				</div>
			</div>
		</>
	);
}
