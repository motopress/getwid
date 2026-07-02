/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
import { get, cloneDeep } from 'lodash';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import attributes from './attributes';
import Inspector from './inspector';
import Point from "./point";

import './editor.scss';
import './style.scss';

/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { Component, Fragment, createRef } = wp.element;
const { ToolbarGroup, ToolbarButton } = wp.components;
const { BlockControls, MediaPlaceholder, MediaUpload, MediaUploadCheck } = wp.blockEditor || wp.editor;
const { withSelect } = wp.data;

const { jQuery: $ } = window;

/**
 * Module Constants
 */
const ALLOWED_MEDIA_TYPES = [ 'image' ];
const baseClass = 'wp-block-getwid-image-hotspot';

/**
 * Create an Component
 */
class Edit extends Component {

	constructor() {
		super(...arguments);

		this.onCancelPoint = this.onCancelPoint.bind( this );
		this.onDeletePoint = this.onDeletePoint.bind( this );
		this.changeState = this.changeState.bind( this );
		this.getState = this.getState.bind( this );
		this.onImageClick = this.onImageClick.bind( this );
		this.addPoint = this.addPoint.bind( this );
		this.updatePoint = this.updatePoint.bind( this );

		this.imageHotspotRef = createRef();

		this.state = {
			currentPoint: null,
			action: false,
			editModal: false,
			recentlyAddedPoint: false
		};
	}

	changeState(param, value) {
		if (typeof param == 'object') {
			this.setState(param);
		} else if (typeof param == 'string') {
			this.setState({[param]: value});
		}
	}

	getState(value) {
		return this.state[value];
	}

	onDuplicatePoint(pointID = 0) {
		const {
			attributes: {
				imagePoints
			},
			setAttributes,
		} = this.props;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const cloned_imagePointsParsed = cloneDeep(imagePointsParsed);
		const current_dot = cloned_imagePointsParsed[pointID];

		var coord_x = parseInt(current_dot.position.x, 10) + 3;
		var coord_y = parseInt(current_dot.position.y, 10) + 3;

		coord_x = (coord_x > 98) ? 98 : coord_x;
		coord_y = (coord_y > 96) ? 96 : coord_y;

		current_dot.position.x = coord_x + '%';
		current_dot.position.y = coord_y + '%';

		const newPoints = imagePointsParsed;

		const pointIndex = newPoints.push( current_dot ) - 1;

		setAttributes({
			imagePoints: JSON.stringify(newPoints),
		});

		this.setState( {
			currentPoint: pointIndex,
			recentlyAddedPoint: null,
			editModal: true
		} );
	}

	onDeletePoint(pointID = 0) {

		const { changeState } = this;
		const { imagePoints } = this.props.attributes;
		const { setAttributes } = this.props;

		const imagePointsParsed = imagePoints != '' ? JSON.parse( imagePoints ) : [];

		const newItems = imagePointsParsed.filter( (item, idx) => idx !== pointID );

		changeState( {
			currentPoint: null
		} );

		setAttributes( {
			imagePoints: JSON.stringify( newItems )
		} );
	}

	onCancelPoint() {

		const { setAttributes } = this.props;
		const { getState, changeState } = this;
		const { imagePoints } = this.props.attributes;

		const imagePointsParsed = imagePoints != '' ? JSON.parse( imagePoints ) : [];

		const newItems = imagePointsParsed.filter( (item, idx) => idx !== getState( 'currentPoint' ) );

		setAttributes( {
			imagePoints: JSON.stringify( newItems )
		} );

		changeState({
			currentPoint: null
		});
	}

	onImageClick( event ) {
		event.preventDefault();
		event.stopPropagation();

		this.addPoint( event.clientX, event.clientY );
	}

	addPoint( x, y ) {
		const {
			attributes: {
				imagePoints
			},
			setAttributes,
		} = this.props;

		const points = ( imagePoints !== '' ? JSON.parse(imagePoints) : [] );

		const pointIndex = points.push( {
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
			position: { x, y }
		} ) - 1;

		setAttributes( {
			imagePoints: JSON.stringify( points ),
		} );

		this.setState( {
			currentPoint: pointIndex,
			recentlyAddedPoint: pointIndex,
			editModal: true
		} );

	}

	updatePoint( index, newPointValues ) {
		const { imagePoints } = this.props.attributes;
		const points = JSON.parse( imagePoints );

		points[ index ] = { ...points[ index ], ...newPointValues }

		this.props.setAttributes( {
			imagePoints: JSON.stringify( points )
		} );
	}

	render() {

		const { id, url, alt, imagePoints } = this.props.attributes;
		const { dotIcon, dotSize, dotPaddings, dotColor, dotBackground, dotOpacity, dotPulse } = this.props.attributes;
		const { tooltipTheme, tooltipArrow, tooltipAnimation } = this.props.attributes;
		const { className, isSelected, setAttributes, clientId } = this.props;
		const { onCancelPoint, onDeletePoint, updatePoint, changeState, getState } = this;
		const image = this.imageHotspotRef.current?.querySelector(`.${baseClass}__image`);

		const toolbarControls = [
			{
				icon: 'edit',
				title: __('Edit', 'getwid'),
				isDisabled: (getState('currentPoint') === null || getState('action') == 'drop'),
				isActive: (getState('action') == 'edit' && getState('editModal') == true),
				onClick: () => {
					changeState({
						action: 'edit',
						editModal: true
					});
				},
			},
			{
				icon: 'admin-page',
				title: __('Duplicate', 'getwid'),
				isDisabled: (getState('currentPoint') === null),
				onClick: () => {
					this.onDuplicatePoint(getState('currentPoint'));
				},
			},
			{
				icon: 'trash',
				title: __('Delete', 'getwid'),
				isDisabled: (getState('currentPoint') === null || getState('action') == 'drop'),
				onClick: () => {
					onDeletePoint(getState( 'currentPoint' ));
				},
			}
		];

		const changeImageSize = (media, imageSize) => {

			if ( ! media ) {
				setAttributes( { url: undefined, id: undefined } );
				return;
			}

			setAttributes( {
				id: media.id,
				alt: media.alt,
				url:
					get( media, [ 'media_details', 'sizes', imageSize, 'source_url' ]) ||
					get( media, [ 'media_details', 'sizes', 'large', 'source_url' ] ) ||
					get( media, [ 'media_details', 'sizes', 'full', 'source_url' ] ) ||
					get( media, [ 'sizes', imageSize, 'url' ]) ||
					media.url
			} );
		};

		const onSelectMedia = media => {

			const { imageSize } = this.props.attributes;

			if ( ! [ 'full', 'large', 'medium', 'thumbnail' ].includes( imageSize ) ) {
				setAttributes( {
					imageSize: attributes.imageSize.default
				} );
			}

			changeImageSize( media, imageSize );
		};

		const controls = (
			<Fragment>
				{ ! url && (
					<MediaPlaceholder
						icon={'format-image'}
						className={baseClass}
						labels={{
							title: __('Image Hotspot', 'getwid'),
						}}
						onSelect={onSelectMedia}
						accept="image/*"
						allowedTypes={ALLOWED_MEDIA_TYPES}
					/>
				)}
				<BlockControls>
					{ !! url && (
						<MediaUploadCheck>
							<ToolbarGroup>
								<MediaUpload
									onSelect={onSelectMedia}
									allowedTypes={ALLOWED_MEDIA_TYPES}
									value={id}
									render={({open}) => (
										<ToolbarButton
											label={__('Edit Media', 'getwid')}
											icon="format-image"
											onClick={open}
										/>
									)}
								/>
							</ToolbarGroup>
						</MediaUploadCheck>
					) }
				</BlockControls>
			</Fragment>
		);

		const wrapperProps = {
			className: classnames(className, {
					'is-selected': isSelected,
					[ `${baseClass}--dropPoint` ]: getState( 'action' ) == 'drop'
				}
			)
		};

		const innerWrapperProps = classnames(
			`${baseClass}__wrapper`
		);

		const points = ( imagePoints !== '' ? JSON.parse(imagePoints) : [] );

		const pointsHTML = points.map( ( point, pointID ) =>
			<Point
				key={ pointID }
			   	{ ...point }
				isSelected={ pointID === this.state.currentPoint }
				isRecentlyAdded={ pointID === this.state.recentlyAddedPoint }
				common={ {
					icon: dotIcon,
					size: dotSize,
					padding: dotPaddings,
					color: dotColor,
					backgroundColor: dotBackground,
					opacity: dotOpacity,
					pulse: dotPulse
				} }
				tooltip={ {
					theme: tooltipTheme,
					arrow: tooltipArrow,
					animation: tooltipAnimation
				} }
				onMoveEnd={ ( x, y ) => {
					this.updatePoint( pointID, { position: { x, y } } );
				} }
				onSelect={ () => {
					this.setState( {
						currentPoint: pointID
					} );
				} }
				onDeselect={ () => {
					this.setState( {
						currentPoint: null
					} );
				} }
				onCreate={ ( point, coordinates ) => {
					this.setState( {
						recentlyAddedPoint: null
					} );

					this.updatePoint( pointID, { position: { x: coordinates.x, y: coordinates.y } } )
				} }
			/>
		);

		return (
			<Fragment>
				<div { ...wrapperProps } ref={ this.imageHotspotRef }>
					{controls}
					{ !! url && (
						<Fragment>
							<BlockControls>
								<ToolbarGroup>
									<ToolbarButton
										isDisabled={ getState('currentPoint') != null }
										onClick={ () => {
											if (getState('action') != 'drop') {
												changeState('action', 'drop');
											}
										} }
									>
										{ __('Drop Point', 'getwid') }
									</ToolbarButton>
								</ToolbarGroup>
								<ToolbarGroup
									controls={toolbarControls}
								/>
							</BlockControls>

							<Inspector
								{ ...{
									...this.props,
									setAttributes,
									onCancelPoint,
									onDeletePoint,
									changeImageSize,
									changeState,
									getState,
									onSelectMedia,
									updatePoint,
									hasSelectedPoint: this.state.currentPoint !== null,
									selectedPoint: this.state.currentPoint
								} }
							/>
						</Fragment>
					)}
					<div className={ innerWrapperProps }>
						{ url && (
							<img
								className={ `${baseClass}__image` }
								src={ url }
								alt={ alt ? alt : '' }
								onClick={ ( e ) => {
									this.state.action === 'drop' && this.onImageClick( e );
								} }
							/>
						) }
						{ pointsHTML }
					</div>
				</div>
			</Fragment>
		);
	}

	componentDidMount() {

	}

	componentDidUpdate(prevProps, prevState) {

		if ( prevProps.isSelected && ! this.props.isSelected ) {
			this.setState( {
				currentPoint: null,
				recentlyAddedPoint: null
			} );
		}
	}
}

export default compose( [
	withSelect( (select, props) => {
		const { getMedia } = select('core');
		const { id } = props.attributes;

		if ( typeof id != 'undefined' ) {
			return {
				imgObj: id ? getMedia( id ) : null
			};
		}
	} ),
])( Edit );
