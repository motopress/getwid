import {
	BlockControls,
	InnerBlocks,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import Navigation from './navigation';
import type { ContentSliderEditProps } from './types';

import './editor.scss';

export default function Edit( props: ContentSliderEditProps ) {
	const { attributes, clientId, className, isSelected } = props;
	const [ activeSlideIndex, setActiveSlideIndex ] = useState( 0 );
	const sliderRef = useRef< HTMLDivElement >( null );
	const { insertBlock, selectBlock } = useDispatch( blockEditorStore );
	const {
		block,
		blockOrder,
		hasSelectedSlide,
		selectedBlockClientId,
		selectedSlideIndex,
	} = useSelect(
		( select ) => {
			const store = select( blockEditorStore );
			const selectedClientId = store.getSelectedBlockClientId();

			return {
				block: store.getBlock( clientId ),
				blockOrder: store.getBlockOrder( clientId ),
				hasSelectedSlide: store.hasSelectedInnerBlock( clientId ),
				selectedBlockClientId: selectedClientId,
				selectedSlideIndex: selectedClientId
					? store.getBlockIndex( selectedClientId, clientId )
					: 0,
			};
		},
		[ clientId ]
	);
	const slidesCount = blockOrder.length;
	const activeSlideID =
		blockOrder[ activeSlideIndex ] || blockOrder[ 0 ] || '';
	const blockProps = useBlockProps( {
		className: clsx(
			className,
			`has-arrows-${ attributes.arrows }`,
			`has-dots-${ attributes.dots }`
		),
	} );

	function addSlide() {
		if ( ! block ) {
			return;
		}

		const insertedBlock = createBlock( 'getwid/content-slider-slide' );
		insertBlock( insertedBlock, block.innerBlocks.length, clientId );
	}

	function activateSlide( index: number ) {
		const nextIndex = Math.max(
			0,
			Math.min( index, Math.max( blockOrder.length - 1, 0 ) )
		);

		setActiveSlideIndex( nextIndex );
	}

	useEffect( () => {
		if ( blockOrder.length <= 0 ) {
			setActiveSlideIndex( 0 );
			return;
		}

		if (
			hasSelectedSlide &&
			selectedBlockClientId &&
			selectedSlideIndex >= 0
		) {
			setActiveSlideIndex( selectedSlideIndex );
			return;
		}

		if ( activeSlideIndex >= blockOrder.length ) {
			setActiveSlideIndex( blockOrder.length - 1 );
		}
	}, [
		activeSlideIndex,
		blockOrder,
		hasSelectedSlide,
		selectedBlockClientId,
		selectedSlideIndex,
	] );

	useEffect( () => {
		const ownerDocument = sliderRef.current?.ownerDocument;
		const visibleSlideID =
			blockOrder[ activeSlideIndex ] || blockOrder[ 0 ] || '';

		if ( ! ownerDocument ) {
			return;
		}

		blockOrder.forEach( ( blockId ) => {
			ownerDocument
				.getElementById( `block-${ blockId }` )
				?.setAttribute( 'data-hidden', 'true' );
		} );

		if ( visibleSlideID ) {
			ownerDocument
				.getElementById( `block-${ visibleSlideID }` )
				?.removeAttribute( 'data-hidden' );
		}
	}, [ activeSlideIndex, blockOrder ] );

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						label={ __( 'Add Slide', 'getwid' ) }
						onClick={ addSlide }
					>
						{ __( 'Add Slide', 'getwid' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>

			<Inspector { ...props } />

			<div { ...blockProps }>
				<Navigation
					addSlide={ addSlide }
					activateSlide={ activateSlide }
					activeSlideIndex={ activeSlideIndex }
					activeSlideID={ activeSlideID }
					slidesCount={ slidesCount }
					slidesOrder={ blockOrder }
					selectBlock={ selectBlock }
					isEditActive={ isSelected }
				/>
				<div
					className="wp-block-getwid-content-slider__wrapper"
					ref={ sliderRef }
				>
					<InnerBlocks
						template={ [ [ 'getwid/content-slider-slide', {} ] ] }
						allowedBlocks={ [ 'getwid/content-slider-slide' ] }
						templateLock={ false }
						renderAppender={ () => null }
						orientation="horizontal"
					/>
				</div>
			</div>
		</>
	);
}
