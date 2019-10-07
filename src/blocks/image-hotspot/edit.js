/**
 * External dependencies
 */
import classnames from 'classnames';
import './editor.scss';
import './style.scss'
import Inspector from './inspector';
import {merge, isEqual, get, escape, unescape, cloneDeep} from "lodash";

/**
 * WordPress dependencies
 */
import {__} from 'wp.i18n';

const {compose} = wp.compose;
const {
	BlockControls, MediaPlaceholder, MediaUpload, MediaUploadCheck
} = wp.editor;
const {
	withSelect,
	dispatch
} = wp.data;
const {Component, Fragment} = wp.element;
const {Toolbar, IconButton} = wp.components;
const $ = window.jQuery;


/**
 * Module Constants
 */
const ALLOWED_MEDIA_TYPES = ['image'];
const baseClass = 'wp-block-getwid-image-hotspot';

/**
 * Create an Component
 */
class Edit extends Component {

	constructor() {
		super(...arguments);

		this.getRelativePosition = this.getRelativePosition.bind(this);
		this.initHotspotEvents = this.initHotspotEvents.bind(this);
		this.initTooltips = this.initTooltips.bind(this);
		this.initDot = this.initDot.bind(this);
		this.renderDot = this.renderDot.bind(this);
		this.initPoints = this.initPoints.bind(this);
		this.onCancelPoint = this.onCancelPoint.bind(this);
		this.onDeletePoint = this.onDeletePoint.bind(this);
		this.updateArrValues = this.updateArrValues.bind(this);
		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);

		this.state = {
			highlightDot: false,
			currentPoint: null,
			updatePoints: false,
			action: false,
			editModal: false,
			deleteModal: false,
		};
	}

	updateArrValues(value, index) {

		//Recursive iterate object value
		const deepMap = (obj, cb) => {
			var out = {};

			Object.keys(obj)
				.forEach(function (k) {
					var val;
					if (obj[k] !== null && typeof obj[k] === 'object') {
						val = deepMap(obj[k], cb);
					} else {
						val = cb(obj[k], k);
					}

					out[k] = val;
				});

			return out;
		}

		//Replace undefined to ''
		value = deepMap(value, function (v, k) {
			if (typeof v == 'undefined') {
				v = '';
			}
			return v;
		});

		const {attributes, setAttributes} = this.props;
		const {imagePoints} = attributes;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const newItems = imagePointsParsed.map((item, thisIndex) => {
			if (index === thisIndex) {
				item = merge(item, value);
			}
			return item;
		});

		setAttributes({
			imagePoints: JSON.stringify(newItems),
		});
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

	getRelativePosition(event, el, hotspotsize) {
		var x, y;
		var left = el.offset().left;
		var top = el.offset().top;
		var hotspot = hotspotsize ? hotspotsize : 0;

		x = (event.pageX - left - (hotspot / 2)) / el.outerWidth() * 100;
		y = (event.pageY - top - (hotspot / 2)) / el.outerHeight() * 100;

		return {
			x: parseFloat(x).toFixed(2) + '%',
			y: parseFloat(y).toFixed(2) + '%'
		};
	}

	initTooltips() {
		const {
			attributes: {
				imagePoints,

				tooltipTrigger,
				tooltipTheme,
				tooltipArrow,
				tooltipAnimation,
			},
		} = this.props;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		jQuery('.tippy-popper').remove();

		const thisBlock = $(ReactDOM.findDOMNode(this));
		const hotspots = $(`.${baseClass}__wrapper .${baseClass}__dot`, thisBlock);

		$.each(hotspots, function (index, val) {
			let dot = jQuery(val),
				point_id = dot.data('point-id'),
				title = dot.find(`.${baseClass}__dot-title`).html(),
				content = unescape(imagePointsParsed[point_id].content),
				placement = imagePointsParsed[point_id].placement,
				width = imagePointsParsed[point_id].popUpWidth;

			if (title || content) {
				let tooltip = tippy(val, {
					maxWidth: parseInt(width, 10),
					theme: tooltipTheme,
					animation: tooltipAnimation,
					animateFill: false,
					interactive: true,
					trigger: 'mouseenter',
					arrow: tooltipArrow,
					placement: placement,
					content: `<div class="${baseClass}__tooltip"><div class="${baseClass}__tooltip-title">${title}</div><div class="${baseClass}__tooltip-content">${content}</div></div>`,
				});
			}

			dot.find(`.${baseClass}__dot-description`).remove();
		});

	}

	initHotspotEvents() {
		const {
			attributes: {
				dotSize,
			},
			clientId,
		} = this.props;

		const onCancelPoint = this.onCancelPoint;
		const getRelativePosition = this.getRelativePosition;
		const updateArrValues = this.updateArrValues;
		const changeState = this.changeState;
		const getState = this.getState;
		const renderDot = this.renderDot;

		const thisBlock = $(ReactDOM.findDOMNode(this));

		const imageWrapper = $(`.${baseClass}__wrapper`, thisBlock);
		const imageDots = $(`.${baseClass}__wrapper .${baseClass}__dot`, thisBlock);

		if (getState('highlightDot') == true && getState('currentPoint') != null) {
			imageDots.removeClass('is-selected');
			imageWrapper.find(`.${baseClass}__dot[data-point-id="${getState('currentPoint')}"]`).addClass('is-selected');
			imageWrapper.find(`.${baseClass}__dot[data-point-id="${getState('currentPoint')}"]`).addClass('is-selected');

			changeState({
				highlightDot: false,
			});
		}

		//Clear listeners
		imageDots.off();
		imageWrapper.off();

		//Remove menu
		imageWrapper.contextmenu(function () {
			return false;
		});
		imageDots.contextmenu(function () {
			return false;
		});

		
		//Click Event
		imageDots.on('click', function (e) {
			dispatch( 'core/editor' ).selectBlock(clientId);

			e.stopPropagation();
			e.preventDefault();

			imageDots.removeClass('is-selected');
			jQuery(this).addClass('is-selected');

			//Change current dot
			changeState('currentPoint', jQuery(this).data('point-id'));

		});

		imageDots.mousedown(function (e) {
			//Wheel click
			if (e.button == 1) {
				e.preventDefault();
				changeState('currentPoint', jQuery(this).data('point-id'));
				changeState({
					action: 'edit',
					editModal: true
				});
				return false;
			}

			//Right click
			if (e.button == 2) {
				e.preventDefault();
				changeState({
					deleteModal: true
				});
				return false;
			}
		});

		//Drag Event
		imageWrapper.imagesLoaded().done(function (instance) {

			$.each(imageDots, function (index, dot) {
				dot.oncontextmenu = function () {
					return false;
				};

				var draggable_dot = new Draggabilly(dot, {
					containment: imageWrapper,
				});

				draggable_dot.on('dragStart', function (event, pointer) {
					imageDots.removeClass('is-selected');
					jQuery(dot).addClass('is-selected');
					jQuery('.tippy-popper').remove();
				});

				draggable_dot.on('dragEnd', function (event, pointer) {
					var x_coords = parseFloat((dot.offsetLeft / dot.parentNode.offsetWidth) * 100).toFixed(2);
					var y_coords = parseFloat((dot.offsetTop / dot.parentNode.offsetHeight) * 100).toFixed(2);

					x_coords = (x_coords < 0) ? 0 : ((x_coords > 100) ? 100 : x_coords) + "%";
					y_coords = (y_coords < 0) ? 0 : ((y_coords > 100) ? 100 : y_coords) + "%";

					dot.style.left = x_coords;
					dot.style.top = y_coords;

					if (getState('currentPoint') == null) {
						changeState('currentPoint', jQuery(dot).data('point-id'));
					}
					updateArrValues({
						position: {
							x: x_coords,
							y: y_coords
						},
					}, jQuery(dot).data('point-id'));
				});

			});

		});

		//Esc (Cancel add point)
		$(document).keyup(function (e) {			
			if (getState('currentPoint') != null && getState('action') == 'drop' && e.which == 27) {

				changeState({
					action: false,
					editModal: false
				});
		
				onCancelPoint();
			}
		});

		//Add new point
		imageWrapper.on('click', function (e) {

			imageDots.removeClass('is-selected');

			if (getState('action') == 'drop') {
				let coords = getRelativePosition(e, $(this), dotSize);

				//Add blank Dot
				let hotspot = renderDot(getState('currentPoint'), coords.x, coords.y);

				jQuery(this).append(hotspot);

				updateArrValues({
					position: {
						x: coords.x,
						y: coords.y
					},
				}, getState('currentPoint'));

				changeState('editModal', true);
			} else {
				if (e.target == jQuery(`.${baseClass}__image`, jQuery(this))[0]) {
					//Remove selection
					changeState('currentPoint', null);
				}
			}

		});
	}

	renderDot(pointID = 0, coordx = 0, coordy = 0, title = '', link = '', newTab = false, override_icon = '', override_color = '', override_backgroundColor = '') {
		const {
			attributes: {
				dotIcon,
				dotSize,
				dotPaddings,
				dotColor,
				dotBackground,
				dotOpacity,
				dotPulse,
			},
		} = this.props;

		let icon = override_icon ? override_icon : dotIcon,
			color = override_color ? override_color : dotColor,
			background = override_backgroundColor ? override_backgroundColor : dotBackground;

		let style = '';
		let dot_style = '';

		if (dotSize && dotSize != 16) {
			dot_style += 'font-size: ' + dotSize + 'px;';
		}
		if (dotPaddings && dotPaddings != 6) {
			style += 'padding: ' + dotPaddings + 'px;';
		}
		if (color) {
			dot_style += 'color: ' + color + ';';
		}
		if (background) {
			style += 'background-color: ' + background + ';';
		}
		if (dotOpacity && dotOpacity != 100) {
			style += 'opacity: ' + (dotOpacity / 100) + ';';
		}

		let class_name = classnames(
			`${baseClass}__dot`,
			{
				[`has-animation-${dotPulse}`] : (dotPulse != 'none')
			},
		);

		let link_HTML = '';
		if (link != '') {
			link_HTML = `<a href="${link}"` + (newTab ? ' target="_blank" rel="noopener noreferrer"' : '') + `>${title}</a>`
		} else {
			link_HTML = title;
		}

		//Dot HTML
		let hotspot = `<div data-point-id="${pointID}" class="${class_name}" style="left: ${coordx}; top: ${coordy};` + (style != '' ? style : '') + `">
			<div class="wp-block-getwid-image-hotspot__dot-wrapper">
				<div` + (dot_style != '' ? ' style="' + dot_style + '"' : '') + ` class="wp-block-getwid-image-hotspot__dot-content"><i class="${icon} ${baseClass}__dot-icon"></i></div>
				<div class="wp-block-getwid-image-hotspot__dot-description">
					<div class="wp-block-getwid-image-hotspot__dot-title">${link_HTML}</div>
				</div>
			</div>
		</div>
		`;

		return hotspot;
	}

	initDot(pointID = 0, dotObj = false) {
		const renderDot = this.renderDot;

		var hotspot = renderDot(pointID, dotObj['position'].x, dotObj['position'].y, dotObj['title'], dotObj['link'], dotObj['newTab'], dotObj['icon'], dotObj['color'], dotObj['backgroundColor']);

		const thisBlock = $(ReactDOM.findDOMNode(this));
		const imageWrapper = $(`.${baseClass}__wrapper`, thisBlock);

		imageWrapper.append(hotspot);
	}

	//Events & tooltips
	initPoints(isUpdate = false) {
		const {
			attributes: {
				imagePoints
			},
		} = this.props;

		const initDot = this.initDot;
		const changeState = this.changeState;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const thisBlock = $(ReactDOM.findDOMNode(this));
		const imageDots = $(`.${baseClass}__wrapper .${baseClass}__dot`, thisBlock);

		imageDots.remove();
		if (imagePointsParsed.length) {
			$.each(imagePointsParsed, function (index, val) {
				initDot(index, val);
			});
		}

		if (isUpdate) {
			changeState('updatePoints', false);
		}

		this.initHotspotEvents();
		this.initTooltips();
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
		const changeState = this.changeState;

		newPoints.push(current_dot);

		setAttributes({
			imagePoints: JSON.stringify(newPoints),
		});

		changeState({
			currentPoint: (newPoints.length == 1) ? 0 : (newPoints.length - 1),
			highlightDot: true,
			updatePoints: true
		});
	}

	onAddPoint() {
		const {
			attributes: {
				imagePoints
			},
			setAttributes,
		} = this.props;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const newPoints = imagePointsParsed;
		const changeState = this.changeState;

		newPoints.push(
			{
				title: '',
				link: '',
				newTab: false,
				content: '',
				popUpOpen: false,
				popUpWidth: 350,
				placement: 'top',
				position: {
					x: 0,
					y: 0,
				},
				icon: '',
				color: '',
				backgroundColor: ''
			}
		);

		setAttributes({
			imagePoints: JSON.stringify(newPoints),
		});

		changeState('currentPoint', (newPoints.length == 1) ? 0 : (newPoints.length - 1));
	}

	onDeletePoint(pointID = 0) {
		const {
			attributes: {
				imagePoints
			},
			setAttributes
		} = this.props;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const changeState = this.changeState;

		const newItems = imagePointsParsed.filter((item, idx) => idx !== pointID);

		changeState({
			deleteModal: false,
			currentPoint: null,
			updatePoints: true
		});

		setAttributes({
			imagePoints: JSON.stringify(newItems),
		});
	}

	onCancelPoint() {
		const {
			attributes: {
				imagePoints
			},
			setAttributes
		} = this.props;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const getState = this.getState;
		const changeState = this.changeState;
		const newItems = imagePointsParsed.filter((item, idx) => idx !== getState('currentPoint'));

		setAttributes({
			imagePoints: JSON.stringify(newItems),
		});

		changeState({
			currentPoint: null,
			updatePoints: true
		});		
	}

	render() {
		const {
			attributes: {
				id,
				url,
				alt,
			},
			className,
			isSelected,
			setAttributes,
		} = this.props;

		const onCancelPoint = this.onCancelPoint;
		const onDeletePoint = this.onDeletePoint;
		const updateArrValues = this.updateArrValues;
		const changeState = this.changeState;
		const getState = this.getState;
		const thisBlock = $(ReactDOM.findDOMNode(this));

		const toolbarControls = [
			{
				icon: 'location',
				title: __('Drop Point', 'getwid'),
				isDisabled: (getState('currentPoint') != null),
				isActive: (getState('action') == 'drop'),
				onClick: () => {
					if (getState('action') != 'drop') {
						this.onAddPoint();
						changeState('action', 'drop');
					}
				},
			},
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
				isActive: (getState('deleteModal') == true),
				onClick: () => {
					changeState({
						deleteModal: true
					});
				},
			}
		];

		const changeImageSize = (media, imageSize) => {
			if (!media) {
				setAttributes({url: undefined, id: undefined});
				return;
			}

			setAttributes({
				id: media.id,
				alt: media.alt,
				url: get(media, ['sizes', imageSize, 'url']) || get(media, ['media_details', 'sizes', imageSize, 'source_url']) || media.url,
			});
		};

		const onSelectMedia = (media) => {
			let {
				attributes: {
					imageSize,
				},
			} = this.props;

			if (!['full', 'large', 'medium', 'thumbnail'].includes(imageSize)) {
				imageSize = attributes.imageSize.default;
				setAttributes({
					imageSize
				});
			}

			changeImageSize(media, imageSize);
		};

		const controls = (
			<Fragment>
				{!url && (
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
					{!!url && (
						<Fragment>
							<MediaUploadCheck>
								<Toolbar>
									<MediaUpload
										onSelect={onSelectMedia}
										allowedTypes={ALLOWED_MEDIA_TYPES}
										value={id}
										render={({open}) => (
											<IconButton
												className="components-toolbar__control"
												label={__('Edit Media', 'getwid')}
												icon="format-image"
												onClick={open}
											/>
										)}
									/>
								</Toolbar>
							</MediaUploadCheck>
						</Fragment>
					)}
				</BlockControls>
			</Fragment>
		);

		const wrapperProps = {
			className: classnames(className,
				{
					'is-selected': isSelected,
					[`${baseClass}--dropPoint`]: (getState('action') == 'drop')
				},
			),
		};

		const innerWrapperProps = classnames(
			`${baseClass}__wrapper`,
		);

		const imageHTML = url ? (
			<img src={url} alt={(typeof alt != 'undefined' ? alt : null)} className={`${baseClass}__image`}/>) : null;

		return (
			<Fragment>
				<div {...wrapperProps}>
					{controls}
					{!!url && (
						<Fragment>
							<BlockControls>
								<Toolbar
									controls={toolbarControls}
								/>
							</BlockControls>

							<Inspector {...{
								setAttributes,
								...this.props,
								...{onCancelPoint},
								...{onDeletePoint},
								...{updateArrValues},
								...{changeImageSize},
								...{changeState},
								...{getState},
								...{thisBlock},
							}} key='inspector'/>
						</Fragment>
					)}
					<div className={innerWrapperProps}>
						{imageHTML}
					</div>
				</div>
			</Fragment>
		);
	}

	componentDidMount() {
		this.initPoints(false);
	}

	componentDidUpdate(prevProps, prevState) {
		const getState = this.getState;
		// const needRender = (!isEqual(this.props.attributes, prevProps.attributes));
		const needRender = (!isEqual(this.props.attributes, prevProps.attributes)) && (isEqual(this.props.attributes.imagePoints, prevProps.attributes.imagePoints));

		//Disable right click on modal window
		$(`.${baseClass}__modal-delete`).contextmenu(function () {
			return false;
		});
		$(`.components-modal__screen-overlay`).contextmenu(function () {
			return false;
		});
		
		if (needRender || getState('updatePoints') == true) {
			this.initPoints(true);
		}
	}

}

export default compose([
	withSelect((select, props) => {
		const {getMedia} = select('core');
		const {id} = props.attributes;

		if (typeof id != 'undefined') {
			return {
				imgObj: id ? getMedia(id) : null,
			};
		}
	}),
])(Edit);
