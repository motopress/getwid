import {
	InnerBlocks,
	getColorObjectByAttributeValues,
	store as blockEditorStore,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Inspector from './inspector';
import type { ContentTimelineEditProps } from './types';

import './editor.scss';

const allowedBlocks = [ 'getwid/content-timeline-item' ];

type EditorSettings = {
	colors?: Array< {
		name: string;
		slug: string;
		color: string;
	} >;
};

type BlockEditorSelect = {
	getBlock: ( clientId: string ) => {
		innerBlocks: Array< { clientId: string } >;
	} | null;
	getSettings: () => EditorSettings;
};

function Edit( props: ContentTimelineEditProps ) {
	const { attributes, clientId, baseClass } = props;
	const [ isLockedPaddings, setIsLockedPaddings ] = useState( false );
	const timelineRef = useRef< HTMLDivElement >( null );
	const { updateBlockAttributes, insertBlock } =
		useDispatch( blockEditorStore );
	const { block, editorColors } = useSelect(
		( select ) => {
			const store = select( blockEditorStore ) as BlockEditorSelect;

			return {
				block: store.getBlock( clientId ),
				editorColors: store.getSettings().colors || [],
			};
		},
		[ clientId ]
	);
	const blockProps = useBlockProps();

	function getFillColor() {
		const { fillColor, customFillColor } = attributes;

		if ( fillColor ) {
			return getColorObjectByAttributeValues( editorColors, fillColor )
				?.color;
		}

		return customFillColor;
	}

	const pointColor = getFillColor();

	const setPointsColor = useCallback( ( color?: string ) => {
		const currentBlock = timelineRef.current;
		const points = currentBlock?.querySelectorAll(
			'.wp-block-getwid-content-timeline-item__point.is-active'
		);

		points?.forEach( ( point ) => {
			const pointContent = point.querySelector< HTMLElement >(
				'.wp-block-getwid-content-timeline-item__point-content'
			);

			if ( pointContent ) {
				pointContent.style.borderColor = color || '';
			}
		} );
	}, [] );

	const resetActivePoints = useCallback( () => {
		const currentBlock = timelineRef.current;
		const points = currentBlock?.querySelectorAll(
			'.wp-block-getwid-content-timeline-item__point.is-active'
		);

		points?.forEach( ( point ) => {
			const pointContent = point.querySelector< HTMLElement >(
				'.wp-block-getwid-content-timeline-item__point-content'
			);

			point.classList.remove( 'is-active' );

			if ( pointContent ) {
				pointContent.style.borderColor = '';
			}
		} );
	}, [] );

	const setScrollProgressPreview = useCallback( () => {
		const currentBlock = timelineRef.current;

		if ( ! currentBlock ) {
			return;
		}

		const items = currentBlock.querySelectorAll< HTMLElement >(
			'.wp-block-getwid-content-timeline-item__wrapper'
		);
		const points = currentBlock.querySelectorAll< HTMLElement >(
			'.wp-block-getwid-content-timeline-item__point'
		);
		const line = currentBlock.querySelector< HTMLElement >(
			'.wp-block-getwid-content-timeline__line'
		);

		if ( ! line || points.length === 0 || items.length === 0 ) {
			return;
		}

		const lineTopPosition = items[ 0 ].offsetHeight / 2;
		const lineBottomPosition = items[ items.length - 1 ].offsetHeight / 2;

		line.style.top = `${ lineTopPosition }px`;
		line.style.bottom = `${ lineBottomPosition }px`;

		if ( attributes.filling === 'false' ) {
			return;
		}

		const bar = line.querySelector< HTMLElement >(
			'.wp-block-getwid-content-timeline__bar'
		);

		if ( ! bar ) {
			return;
		}

		const { height, top } = bar.getBoundingClientRect();
		const maxDotOffset = top + height;

		points.forEach( ( point ) => {
			const pointRect = point.getBoundingClientRect();
			const pointContent = point.querySelector< HTMLElement >(
				'.wp-block-getwid-content-timeline-item__point-content'
			);

			point.classList.remove( 'is-active' );

			if ( pointContent ) {
				pointContent.style.borderColor = '';
			}

			if ( pointRect.top <= maxDotOffset ) {
				point.classList.add( 'is-active' );

				if ( pointContent ) {
					pointContent.style.borderColor =
						pointColor ?? 'currentColor';
				}
			}
		} );
	}, [ attributes.filling, pointColor ] );

	function addItem() {
		if ( ! block ) {
			return;
		}

		const insertedBlock = createBlock( 'getwid/content-timeline-item' );

		insertBlock( insertedBlock, block.innerBlocks.length, clientId );
	}

	useEffect( () => {
		block?.innerBlocks.forEach( ( item ) => {
			updateBlockAttributes( item.clientId, {
				outerParent: {
					attributes: {
						backgroundColor: attributes.backgroundColor,
						customBackgroundColor: attributes.customBackgroundColor,
						paddingTop: attributes.paddingTop,
						paddingBottom: attributes.paddingBottom,
						paddingLeft: attributes.paddingLeft,
						paddingRight: attributes.paddingRight,
						horizontalSpace: attributes.horizontalSpace,
						marginBottom: attributes.marginBottom,
						pointColor,
						animation: attributes.animation,
					},
				},
			} );
		} );
	}, [
		attributes.animation,
		attributes.backgroundColor,
		attributes.customBackgroundColor,
		attributes.horizontalSpace,
		attributes.marginBottom,
		attributes.paddingBottom,
		attributes.paddingLeft,
		attributes.paddingRight,
		attributes.paddingTop,
		block,
		pointColor,
		updateBlockAttributes,
	] );

	useEffect( () => {
		if ( attributes.filling === 'true' ) {
			setScrollProgressPreview();
		} else {
			resetActivePoints();
		}
	}, [ attributes.filling, resetActivePoints, setScrollProgressPreview ] );

	useEffect( () => {
		setPointsColor( pointColor );
	}, [ pointColor, setPointsColor ] );

	useEffect( () => {
		setScrollProgressPreview();

		const currentBlock = timelineRef.current;
		const ResizeObserverClass = window.ResizeObserver;

		if ( ! currentBlock || ! ResizeObserverClass ) {
			return undefined;
		}

		const resizeObserver = new ResizeObserverClass( () => {
			window.setTimeout( setScrollProgressPreview, 500 );
		} );

		resizeObserver.observe( currentBlock );

		return () => resizeObserver.disconnect();
	}, [ setScrollProgressPreview ] );

	const lineStyle = {
		backgroundColor: pointColor || undefined,
		height: attributes.filling === 'true' ? '50%' : undefined,
	};

	return (
		<>
			<Inspector
				{ ...props }
				isLockedPaddings={ isLockedPaddings }
				onChangeLockedPaddings={ setIsLockedPaddings }
			/>
			<div { ...blockProps } ref={ timelineRef }>
				<div className={ `${ baseClass }__line` }>
					<div
						className={ `${ baseClass }__bar` }
						style={ lineStyle }
					/>
				</div>
				<InnerBlocks
					templateInsertUpdatesSelection={ false }
					allowedBlocks={ allowedBlocks }
					template={ [ [ 'getwid/content-timeline-item' ] ] }
					templateLock={ false }
					renderAppender={ () => (
						<div className={ `${ baseClass }__add-item` }>
							<Button
								icon="insert"
								onClick={ addItem }
								label={ __( 'Add Item', 'getwid' ) }
							/>
						</div>
					) }
				/>
			</div>
		</>
	);
}

export default withColors( 'fillColor', 'backgroundColor' )( Edit );
