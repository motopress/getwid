import classnames from "classnames";

const { useState, useCallback, useRef, useEffect } = wp.element;
const { useRefEffect, useMergeRefs  } = wp.compose;

const { safeHTML } = wp.dom;
const { decodeEntities } = wp.htmlEntities;

function Point( props ) {
	const {
		link,
		icon,
		title,
		color,
		content,
		backgroundColor,
		newTab,
		popUpOpen,
		popUpWidth,
		placement,
		position,
		isSelected,
		onMoveEnd,
		onMoveStart,
		common,
		tooltip,
		isRecentlyAdded,
		onSelect,
		onDeselect,
		onCreate
	} = props;

	const isDragged = useRef( false );
	const safeTitle = safeHTML( decodeEntities( title ) );
	const safeContent = safeHTML( decodeEntities( content ) );

	const calculatePosition = useCallback( ( point, mouseX, mouseY ) => {
		const parentRect = point.parentNode.getBoundingClientRect();

		const pointWidth = point.offsetWidth;
		const pointHeight = point.offsetHeight;

		let computedX = mouseX - parentRect.left - pointWidth / 2;
		let computedY = mouseY - parentRect.top - pointHeight / 2;

		if ( computedX > ( parentRect.width - pointWidth ) ) {
			computedX = parentRect.width - pointWidth;
		}

		if ( computedX < 0 ) {
			computedX = 0;
		}

		if ( computedY > ( parentRect.height - pointHeight ) ) {
			computedY = parentRect.height - pointHeight;
		}

		if ( computedY < 0 ) {
			computedY = 0;
		}

		return {
			x: ( 100 * computedX / parentRect.width ).toFixed( 2 ) + '%',
			y: ( 100 * computedY / parentRect.height ).toFixed( 2 ) + '%'
		}
	}, [] );

	const onPointSelect = useCallback( ( event ) => {
		onSelect();
	}, [] );

	const onPointDeselect = useCallback( ( event ) => {

		if ( event.target !== pointElement.current && ! pointElement.current.contains( event.target ) ) {
			onDeselect();
		}

	}, [] );

	const onPointMove = useCallback( ( event ) => {

		const position = calculatePosition( pointElement.current, event.clientX, event.clientY );

		pointElement.current.style.left = position.x;
		pointElement.current.style.top = position.y;

		isDragged.current = true;

	}, [ ] );

	const onPointMoveStart = useCallback( ( event ) => {
		event.preventDefault();
		event.stopPropagation();

		const document = pointElement.current.ownerDocument;

		document.addEventListener('mousemove', onPointMove);
		document.addEventListener('mouseup', onPointMoveEnd);

	}, [ ] );

	const onPointMoveEnd = useCallback( ( event ) => {

		const document = pointElement.current.ownerDocument;

		document.removeEventListener('mousemove', onPointMove);
		document.removeEventListener('mouseup', onPointMoveEnd);

		if ( ! isDragged.current ) return;

		const position = calculatePosition( pointElement.current, event.clientX, event.clientY );

		onMoveEnd( position.x, position.y );

		isDragged.current = false;

	}, [ ] );

	useEffect( () => {
		if ( ! tippy ) return;

		const element = pointElement.current;

		const popup = new tippy(
			element,
			{
				maxWidth: parseInt(popUpWidth, 10),
				theme: tooltip.theme,
				animation: tooltip.animation,
				animateFill: false,
				interactive: true,
				trigger: 'click',
				arrow: tooltip.arrow,
				placement: placement,
				allowHTML: true,
				content: `<div class="wp-block-getwid-image-hotspot__tooltip"><div class="wp-block-getwid-image-hotspot__tooltip-title">${safeTitle}</div><div class="wp-block-getwid-image-hotspot__tooltip-content">${safeContent}</div></div>`
			}
		);

		return () => {
			popup.destroy();
		};

	}, [ tooltip, placement, popUpWidth ] );

	const pointRef = useRefEffect( ( point ) => {

		if ( isSelected ) {
			point.addEventListener('mousedown', onPointMoveStart);
			point.closest('.wp-block-getwid-image-hotspot').addEventListener('click', onPointDeselect);
		} else {
			point.addEventListener('click', onPointSelect);
		}

		if ( isRecentlyAdded ) {
			onCreate( point, calculatePosition( point, position.x, position.y ) );
		}

		return () => {
			point.closest('.wp-block-getwid-image-hotspot').removeEventListener('click', onPointDeselect)
			point.removeEventListener('mousedown', onPointMoveStart);
			point.removeEventListener('click', onPointSelect);
		}
	}, [ isSelected ]);

	const pointElement = useRef();

	const pointMergedRefs = useMergeRefs( [
		pointRef,
		pointElement
	] );

	let link_HTML = '';
	if (link !== '') {
		link_HTML = `<a href="${link}"` + ( newTab ? ' target="_blank" rel="noopener noreferrer"' : '' ) + `>${safeTitle}</a>`
	} else {
		link_HTML = safeTitle;
	}

	return (
		<div
			ref={ pointMergedRefs }
			className={ classnames( 'wp-block-getwid-image-hotspot__dot', {
				[ `has-animation-${common.pulse}` ] : common.pulse !== 'none',
				'is-selected': isSelected
			} ) }
			style={ {
				top: position.y,
				left: position.x,
				backgroundColor: backgroundColor || common.backgroundColor,
				padding: common.padding + 'px',
				opacity: common.opacity / 100
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
					<i className={ `wp-block-getwid-image-hotspot__dot-icon ${icon || common.icon}` }></i>
				</div>
				<div className={ 'wp-block-getwid-image-hotspot__dot-description' }>
					<div className={ 'wp-block-getwid-image-hotspot__dot-title' }>${link_HTML}</div>
				</div>
			</div>
		</div>
	);
}

export default Point;
