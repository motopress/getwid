import { useCallback, useEffect, useRef } from '@wordpress/element';
import clsx from 'clsx';

import type { ImageHotspotPoint, RuntimeGlobal } from './types';
import { baseClass, decodeEntities } from './utils';

type PointProps = ImageHotspotPoint & {
	isSelected: boolean;
	isRecentlyAdded: boolean;
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
		isSelected,
		onMoveEnd,
		common,
		tooltip,
		isRecentlyAdded,
		onSelect,
		onDeselect,
		onCreate,
	} = props;
	const pointElement = useRef< HTMLDivElement | null >( null );
	const isDragged = useRef( false );
	const safeTitle = decodeEntities( title );
	const safeContent = decodeEntities( content );

	const calculatePosition = useCallback(
		( point: HTMLElement, mouseX: number, mouseY: number ) => {
			const parentRect = point.parentElement?.getBoundingClientRect();

			if ( ! parentRect ) {
				return { x: '0%', y: '0%' };
			}

			const pointWidth = point.offsetWidth;
			const pointHeight = point.offsetHeight;
			let computedX = mouseX - parentRect.left - pointWidth / 2;
			let computedY = mouseY - parentRect.top - pointHeight / 2;

			computedX = Math.max(
				0,
				Math.min( computedX, parentRect.width - pointWidth )
			);
			computedY = Math.max(
				0,
				Math.min( computedY, parentRect.height - pointHeight )
			);

			return {
				x: `${ ( ( 100 * computedX ) / parentRect.width ).toFixed(
					2
				) }%`,
				y: `${ ( ( 100 * computedY ) / parentRect.height ).toFixed(
					2
				) }%`,
			};
		},
		[]
	);

	const onPointMove = useCallback(
		( event: MouseEvent ) => {
			if ( ! pointElement.current ) {
				return;
			}

			const nextPosition = calculatePosition(
				pointElement.current,
				event.clientX,
				event.clientY
			);

			pointElement.current.style.left = nextPosition.x;
			pointElement.current.style.top = nextPosition.y;
			isDragged.current = true;
		},
		[ calculatePosition ]
	);

	const onPointMoveEnd = useCallback(
		( event: MouseEvent ) => {
			if ( ! pointElement.current ) {
				return;
			}

			const ownerDocument = pointElement.current.ownerDocument;

			ownerDocument.removeEventListener( 'mousemove', onPointMove );
			ownerDocument.removeEventListener( 'mouseup', onPointMoveEnd );

			if ( ! isDragged.current ) {
				return;
			}

			const nextPosition = calculatePosition(
				pointElement.current,
				event.clientX,
				event.clientY
			);

			onMoveEnd( nextPosition.x, nextPosition.y );
			isDragged.current = false;
		},
		[ calculatePosition, onMoveEnd, onPointMove ]
	);

	const onPointMoveStart = useCallback(
		( event: MouseEvent ) => {
			if ( ! pointElement.current ) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();

			const ownerDocument = pointElement.current.ownerDocument;

			ownerDocument.addEventListener( 'mousemove', onPointMove );
			ownerDocument.addEventListener( 'mouseup', onPointMoveEnd );
		},
		[ onPointMove, onPointMoveEnd ]
	);

	useEffect( () => {
		const runtimeGlobal = window as RuntimeGlobal;
		const currentPoint = pointElement.current;

		if ( ! currentPoint || ! runtimeGlobal.tippy ) {
			return;
		}

		const popup = runtimeGlobal.tippy( currentPoint, {
			maxWidth: parseInt( String( popUpWidth ), 10 ),
			theme: tooltip.theme,
			animation: tooltip.animation,
			animateFill: false,
			interactive: true,
			trigger: 'click',
			arrow: tooltip.arrow,
			placement,
			allowHTML: true,
			content: `<div class="${ baseClass }__tooltip"><div class="${ baseClass }__tooltip-title">${ safeTitle }</div><div class="${ baseClass }__tooltip-content">${ safeContent }</div></div>`,
		} );

		return () => popup.destroy();
	}, [ placement, popUpWidth, safeContent, safeTitle, tooltip ] );

	useEffect( () => {
		const currentPoint = pointElement.current;
		const hotspot = currentPoint?.closest( `.${ baseClass }` );

		if ( ! currentPoint || ! hotspot ) {
			return;
		}

		const onPointSelect = () => onSelect();
		const onPointDeselect = ( event: Event ) => {
			const target = event.target as Node;

			if (
				target !== currentPoint &&
				! currentPoint.contains( target )
			) {
				onDeselect();
			}
		};

		if ( isSelected ) {
			currentPoint.addEventListener( 'mousedown', onPointMoveStart );
			hotspot.addEventListener( 'click', onPointDeselect );
		} else {
			currentPoint.addEventListener( 'click', onPointSelect );
		}

		if ( isRecentlyAdded ) {
			onCreate(
				currentPoint,
				calculatePosition(
					currentPoint,
					Number( position.x ),
					Number( position.y )
				)
			);
		}

		return () => {
			hotspot.removeEventListener( 'click', onPointDeselect );
			currentPoint.removeEventListener( 'mousedown', onPointMoveStart );
			currentPoint.removeEventListener( 'click', onPointSelect );
		};
	}, [
		calculatePosition,
		isRecentlyAdded,
		isSelected,
		onCreate,
		onDeselect,
		onPointMoveStart,
		onSelect,
		position.x,
		position.y,
	] );

	const linkHTML =
		link !== ''
			? `<a href="${ link }"${
					newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
			  }>${ safeTitle }</a>`
			: safeTitle;

	return (
		<div
			ref={ pointElement }
			className={ clsx( `${ baseClass }__dot`, {
				[ `has-animation-${ common.pulse }` ]: common.pulse !== 'none',
				'is-selected': isSelected,
			} ) }
			style={ {
				top: position.y,
				left: position.x,
				backgroundColor: backgroundColor || common.backgroundColor,
				padding: `${ common.padding }px`,
				opacity: common.opacity / 100,
			} }
		>
			<div className={ `${ baseClass }__dot-wrapper` }>
				<div
					className={ `${ baseClass }__dot-content` }
					style={ {
						fontSize: `${ common.size }px`,
						color: color || common.color,
					} }
				>
					<i
						className={ `${ baseClass }__dot-icon ${
							icon || common.icon
						}` }
					/>
				</div>
				<div className={ `${ baseClass }__dot-description` }>
					<div
						className={ `${ baseClass }__dot-title` }
						dangerouslySetInnerHTML={ { __html: linkHTML } }
					/>
				</div>
			</div>
		</div>
	);
}
