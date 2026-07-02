import {
	BlockControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import Point from './point';
import type {
	ChangeState,
	GetState,
	ImageHotspotEditProps,
	ImageHotspotPoint,
	ImageHotspotState,
	MediaObject,
} from './types';
import { baseClass, getImageUrl, parseImagePoints } from './utils';

import './editor.scss';
import './style.scss';

const allowedMediaTypes = [ 'image' ];

type CoreSelect = {
	getMedia: ( id: number ) => MediaObject | null;
};

const defaultPoint: ImageHotspotPoint = {
	link: '',
	icon: '',
	title: '',
	color: '',
	content: '',
	backgroundColor: '',
	newTab: false,
	popUpOpen: false,
	popUpWidth: 350,
	placement: 'top',
	position: { x: 0, y: 0 },
};

export default function Edit( props: ImageHotspotEditProps ) {
	const { attributes, setAttributes, className, isSelected } = props;
	const {
		id,
		url,
		alt,
		imagePoints,
		imageSize,
		dotIcon,
		dotSize,
		dotPaddings,
		dotColor,
		dotBackground,
		dotOpacity,
		dotPulse,
		tooltipTheme,
		tooltipArrow,
		tooltipAnimation,
	} = attributes;
	const [ state, setState ] = useState< ImageHotspotState >( {
		currentPoint: null,
		action: false,
		editModal: false,
		recentlyAddedPoint: null,
	} );
	const imageHotspotRef = useRef< HTMLDivElement | null >( null );
	const imgObj = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' ) as CoreSelect;

			return id ? getMedia( id ) : null;
		},
		[ id ]
	);

	const changeState: ChangeState = ( param, value? ) => {
		if ( typeof param === 'object' ) {
			setState( ( current ) => ( { ...current, ...param } ) );
		} else {
			setState( ( current ) => ( { ...current, [ param ]: value } ) );
		}
	};
	const getState: GetState = ( key ) => state[ key ];

	useEffect( () => {
		if ( ! isSelected ) {
			setState( ( current ) => ( {
				...current,
				currentPoint: null,
				recentlyAddedPoint: null,
			} ) );
		}
	}, [ isSelected ] );

	function updatePoints( points: ImageHotspotPoint[] ) {
		setAttributes( { imagePoints: JSON.stringify( points ) } );
	}

	function updatePoint(
		index: number,
		newPointValues: Partial< ImageHotspotPoint >
	) {
		const points = parseImagePoints( imagePoints );

		points[ index ] = { ...points[ index ], ...newPointValues };
		updatePoints( points );
	}

	function onDeletePoint( pointID = 0 ) {
		updatePoints(
			parseImagePoints( imagePoints ).filter(
				( _item, index ) => index !== pointID
			)
		);
		changeState( { currentPoint: null } );
	}

	function onCancelPoint() {
		const currentPoint = state.currentPoint;

		if ( currentPoint === null ) {
			return;
		}

		updatePoints(
			parseImagePoints( imagePoints ).filter(
				( _item, index ) => index !== currentPoint
			)
		);
		changeState( { currentPoint: null } );
	}

	function addPoint( x: number, y: number ) {
		const points = parseImagePoints( imagePoints );
		const pointIndex =
			points.push( {
				...defaultPoint,
				position: { x, y },
			} ) - 1;

		updatePoints( points );
		changeState( {
			currentPoint: pointIndex,
			recentlyAddedPoint: pointIndex,
			editModal: true,
		} );
	}

	function onDuplicatePoint( pointID = 0 ) {
		const points = parseImagePoints( imagePoints );
		const currentPoint = {
			...points[ pointID ],
			position: { ...points[ pointID ].position },
		};
		let coordX = parseInt( String( currentPoint.position.x ), 10 ) + 3;
		let coordY = parseInt( String( currentPoint.position.y ), 10 ) + 3;

		coordX = coordX > 98 ? 98 : coordX;
		coordY = coordY > 96 ? 96 : coordY;
		currentPoint.position.x = `${ coordX }%`;
		currentPoint.position.y = `${ coordY }%`;

		const pointIndex = points.push( currentPoint ) - 1;

		updatePoints( points );
		changeState( {
			currentPoint: pointIndex,
			recentlyAddedPoint: null,
			editModal: true,
		} );
	}

	function changeImageSize(
		media: MediaObject | null,
		nextImageSize: string
	) {
		if ( ! media ) {
			setAttributes( { url: undefined, id: undefined } );
			return;
		}

		setAttributes( {
			id: media.id,
			alt: media.alt,
			url: getImageUrl( media, nextImageSize ),
		} );
	}

	function onSelectMedia( media: MediaObject ) {
		let nextImageSize = imageSize;

		if (
			! [ 'full', 'large', 'medium', 'thumbnail' ].includes(
				nextImageSize
			)
		) {
			nextImageSize = 'full';
			setAttributes( { imageSize: nextImageSize } );
		}

		changeImageSize( media, nextImageSize );
	}

	const toolbarControls = [
		{
			icon: 'edit',
			title: __( 'Edit', 'getwid' ),
			isDisabled: state.currentPoint === null || state.action === 'drop',
			isActive: state.action === 'edit' && state.editModal === true,
			onClick: () => {
				changeState( {
					action: 'edit',
					editModal: true,
				} );
			},
		},
		{
			icon: 'admin-page',
			title: __( 'Duplicate', 'getwid' ),
			isDisabled: state.currentPoint === null,
			onClick: () => {
				if ( state.currentPoint !== null ) {
					onDuplicatePoint( state.currentPoint );
				}
			},
		},
		{
			icon: 'trash',
			title: __( 'Delete', 'getwid' ),
			isDisabled: state.currentPoint === null || state.action === 'drop',
			onClick: () => {
				if ( state.currentPoint !== null ) {
					onDeletePoint( state.currentPoint );
				}
			},
		},
	];
	const blockProps = useBlockProps( {
		ref: imageHotspotRef,
		className: clsx( className, {
			'is-selected': isSelected,
			[ `${ baseClass }--dropPoint` ]: state.action === 'drop',
		} ),
	} );
	const points = parseImagePoints( imagePoints );

	return (
		<>
			<div { ...blockProps }>
				{ ! url && (
					<MediaPlaceholder
						icon="format-image"
						className={ baseClass }
						labels={ { title: __( 'Image Hotspot', 'getwid' ) } }
						onSelect={ onSelectMedia }
						accept="image/*"
						allowedTypes={ allowedMediaTypes }
					/>
				) }
				<BlockControls>
					{ !! url && (
						<MediaUploadCheck>
							<ToolbarGroup>
								<MediaUpload
									onSelect={ onSelectMedia }
									allowedTypes={ allowedMediaTypes }
									value={ id }
									render={ ( { open } ) => (
										<ToolbarButton
											label={ __(
												'Edit Media',
												'getwid'
											) }
											icon="format-image"
											onClick={ open }
										/>
									) }
								/>
							</ToolbarGroup>
						</MediaUploadCheck>
					) }
				</BlockControls>
				{ !! url && (
					<>
						<BlockControls>
							<ToolbarGroup>
								<ToolbarButton
									isDisabled={ state.currentPoint !== null }
									onClick={ () => {
										if ( state.action !== 'drop' ) {
											changeState( 'action', 'drop' );
										}
									} }
								>
									{ __( 'Drop Point', 'getwid' ) }
								</ToolbarButton>
							</ToolbarGroup>
							<ToolbarGroup controls={ toolbarControls } />
						</BlockControls>
						<Inspector
							{ ...props }
							imgObj={ imgObj }
							changeImageSize={ changeImageSize }
							onSelectMedia={ onSelectMedia }
							onCancelPoint={ onCancelPoint }
							onDeletePoint={ onDeletePoint }
							changeState={ changeState }
							getState={ getState }
							updatePoint={ updatePoint }
							hasSelectedPoint={ state.currentPoint !== null }
							selectedPoint={ state.currentPoint }
						/>
					</>
				) }
				<div className={ `${ baseClass }__wrapper` }>
					{ url && (
						<img
							className={ `${ baseClass }__image` }
							src={ url }
							alt={ alt || '' }
							onClick={ ( event ) => {
								if ( state.action === 'drop' ) {
									event.preventDefault();
									event.stopPropagation();
									addPoint( event.clientX, event.clientY );
								}
							} }
						/>
					) }
					{ points.map( ( point, pointID ) => (
						<Point
							key={ pointID }
							{ ...point }
							isSelected={ pointID === state.currentPoint }
							isRecentlyAdded={
								pointID === state.recentlyAddedPoint
							}
							common={ {
								icon: dotIcon,
								size: dotSize,
								padding: dotPaddings,
								color: dotColor,
								backgroundColor: dotBackground,
								opacity: dotOpacity,
								pulse: dotPulse,
							} }
							tooltip={ {
								theme: tooltipTheme,
								arrow: tooltipArrow,
								animation: tooltipAnimation,
							} }
							onMoveEnd={ ( x, y ) =>
								updatePoint( pointID, { position: { x, y } } )
							}
							onSelect={ () =>
								changeState( { currentPoint: pointID } )
							}
							onDeselect={ () =>
								changeState( { currentPoint: null } )
							}
							onCreate={ ( _point, coordinates ) => {
								changeState( { recentlyAddedPoint: null } );
								updatePoint( pointID, {
									position: coordinates,
								} );
							} }
						/>
					) ) }
				</div>
			</div>
		</>
	);
}
