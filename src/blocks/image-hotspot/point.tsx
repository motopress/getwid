import { useCallback, useEffect, useRef } from '@wordpress/element';
import clsx from 'clsx';

import type { ImageHotspotPoint } from './types';
import { useMergeRefs, useRefEffect } from '@wordpress/compose';
import { safeHTML } from '@wordpress/dom';
import { decodeEntities } from '@wordpress/html-entities';

type PointProps = ImageHotspotPoint & {
	isSelected: boolean;
	isRecentlyAdded: boolean;
	clickedCoordinates: {
		x: number;
		y: number;
	} | null;
	common: {
		icon: string;
		size: number;
		padding: number;
		color?: string;
		backgroundColor?: string;
		opacity: number;
		pulse: string;
	};
	tooltip: {
		theme: string;
		arrow: boolean;
		animation: string;
	};
	onMoveEnd: ( x: string, y: string ) => void;
	onSelect: () => void;
	onDeselect: () => void;
	onCreate: (
		point: HTMLElement,
		coordinates: { x: string; y: string }
	) => void;
};

export default function Point( props: PointProps ) {
	const {
		link,
		icon,
		title,
		color,
		content,
		backgroundColor,
		newTab,
		popUpWidth,
		placement,
		position,
		clickedCoordinates,
		isSelected,
		onMoveEnd,
		common,
		tooltip,
		isRecentlyAdded,
		onSelect,
		onDeselect,
		onCreate,
	} = props;

	const isDragged = useRef( false );
	const safeTitle = safeHTML( decodeEntities( title ) );
	const safeContent = safeHTML( decodeEntities( content ) );

	const calculatePosition = useCallback(
		( point: HTMLElement, mouseX: number, mouseY: number ) => {
			const parent = point.parentNode as Element;
			const parentRect = parent.getBoundingClientRect();

			const pointWidth = point.offsetWidth;
			const pointHeight = point.offsetHeight;
			let computedX = mouseX - parentRect.left - pointWidth / 2;
			let computedY = mouseY - parentRect.top - pointHeight / 2;

			if ( computedX > parentRect.width - pointWidth ) {
				computedX = parentRect.width - pointWidth;
			}

			if ( computedX < 0 ) {
				computedX = 0;
			}

			if ( computedY > parentRect.height - pointHeight ) {
				computedY = parentRect.height - pointHeight;
			}

			if ( computedY < 0 ) {
				computedY = 0;
			}

			return {
				x:
					( ( 100 * computedX ) / parentRect.width ).toFixed( 2 ) +
					'%',
				y:
					( ( 100 * computedY ) / parentRect.height ).toFixed( 2 ) +
					'%',
			};
		},
		[]
	);

	const onPointSelect = useCallback( () => {
		onSelect();
	}, [] );

	const onPointDeselect: EventListener = useCallback( ( event ) => {
		if (
			event.target !== pointElement.current &&
			! pointElement.current?.contains( event.target as Node )
		) {
			onDeselect();
		}
	}, [] );

	const onPointMove: EventListener = useCallback( ( event ) => {
		if ( ! pointElement.current ) {
			return;
		}

		const mouseEvent = event as MouseEvent;

		const calculatedPosition = calculatePosition(
			pointElement.current,
			mouseEvent.clientX,
			mouseEvent.clientY
		);

		pointElement.current.style.left = calculatedPosition.x;
		pointElement.current.style.top = calculatedPosition.y;

		isDragged.current = true;
	}, [] );

	const onPointMoveStart: EventListener = useCallback( ( event ) => {
		event.preventDefault();
		event.stopPropagation();
		if ( ! pointElement.current ) {
			return;
		}

		const document = pointElement.current.ownerDocument;

		document.addEventListener( 'mousemove', onPointMove );
		document.addEventListener( 'mouseup', onPointMoveEnd );
	}, [] );

	const onPointMoveEnd: EventListener = useCallback( ( event ) => {
		if ( ! pointElement.current ) {
			return;
		}

		const document = pointElement.current.ownerDocument;

		document.removeEventListener( 'mousemove', onPointMove );
		document.removeEventListener( 'mouseup', onPointMoveEnd );

		if ( ! isDragged.current ) {
			return;
		}

		const mouseEvent = event as MouseEvent;
		const calculatedPosition = calculatePosition(
			pointElement.current,
			mouseEvent.clientX,
			mouseEvent.clientY
		);

		onMoveEnd( calculatedPosition.x, calculatedPosition.y );

		isDragged.current = false;
	}, [] );

	useEffect( () => {
		if ( ! tippy ) {
			return;
		}

		const element = pointElement.current;

		const popup = new tippy( element, {
			maxWidth: popUpWidth,
			theme: tooltip.theme,
			animation: tooltip.animation,
			animateFill: false,
			interactive: true,
			trigger: 'click',
			arrow: tooltip.arrow,
			placement,
			allowHTML: true,
			content: `<div class="wp-block-getwid-image-hotspot__tooltip"><div class="wp-block-getwid-image-hotspot__tooltip-title">${ safeTitle }</div><div class="wp-block-getwid-image-hotspot__tooltip-content">${ safeContent }</div></div>`,
		} );

		return () => {
			popup.destroy();
		};
	}, [ tooltip, placement, popUpWidth ] );

	const pointRef = useRefEffect(
		( point: HTMLElement ) => {
			if ( isSelected ) {
				point.addEventListener( 'mousedown', onPointMoveStart );
				point
					.closest( '.wp-block-getwid-image-hotspot' )
					?.addEventListener( 'click', onPointDeselect );
			} else {
				point.addEventListener( 'click', onPointSelect );
			}

			if ( isRecentlyAdded && clickedCoordinates ) {
				onCreate(
					point,
					calculatePosition(
						point,
						clickedCoordinates.x,
						clickedCoordinates.y
					)
				);
			}

			return () => {
				point
					.closest( '.wp-block-getwid-image-hotspot' )
					?.removeEventListener( 'click', onPointDeselect );
				point.removeEventListener( 'mousedown', onPointMoveStart );
				point.removeEventListener( 'click', onPointSelect );
			};
		},
		[ isSelected ]
	);

	const pointElement = useRef< HTMLElement >();

	const pointMergedRefs = useMergeRefs( [ pointRef, pointElement ] );

	let linkHTML = '';
	if ( link !== '' ) {
		linkHTML =
			`<a href="${ link }"` +
			( newTab ? ' target="_blank" rel="noopener noreferrer"' : '' ) +
			`>${ safeTitle }</a>`;
	} else {
		linkHTML = safeTitle;
	}

	return (
		<div
			ref={ pointMergedRefs }
			className={ clsx( 'wp-block-getwid-image-hotspot__dot', {
				[ `has-animation-${ common.pulse }` ]: common.pulse !== 'none',
				'is-selected': isSelected,
			} ) }
			style={ {
				top: position.y,
				left: position.x,
				backgroundColor: backgroundColor || common.backgroundColor,
				padding: common.padding + 'px',
				opacity: common.opacity / 100,
			} }
		>
			<div className={ 'wp-block-getwid-image-hotspot__dot-wrapper' }>
				<div
					className={ 'wp-block-getwid-image-hotspot__dot-content' }
					style={ {
						fontSize: common.size + 'px',
						color: color || common.color,
					} }
				>
					<i
						className={ `wp-block-getwid-image-hotspot__dot-icon ${
							icon || common.icon
						}` }
					></i>
				</div>
				<div
					className={
						'wp-block-getwid-image-hotspot__dot-description'
					}
				>
					<div
						className={ 'wp-block-getwid-image-hotspot__dot-title' }
					>
						${ linkHTML }
					</div>
				</div>
			</div>
		</div>
	);
}
