/**
* External dependencies
*/
import classnames from 'classnames';
import animate from 'GetwidUtils/animate';
import './editor.scss';
import './style.scss'
import Inspector from './inspector';
import { merge, isEqual, escape, unescape, get } from "lodash";


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {compose} = wp.compose;
const {
	BlockControls, MediaPlaceholder, MediaUpload, MediaUploadCheck
} = wp.editor;
const {
	withSelect
} = wp.data;
const {Component, Fragment} = wp.element;
const { Toolbar, IconButton } = wp.components;
const $ = window.jQuery;


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
		// this.onDotHoverIn = this.onDotHoverIn.bind(this);

		this.state = {
			currentPoint: null,
			updatePoints: false,
			action: false,
			editModal: false,
		};
	}

	updateArrValues ( value, index ) {

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
			if (typeof v == 'undefined'){
				v = '';
			}
			return v;
		});

		const { attributes, setAttributes } = this.props;
		const { imagePoints } = attributes;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const newItems = imagePointsParsed.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = merge(item, value);
			}
			return item;
		} );

		setAttributes( {
			imagePoints: JSON.stringify(newItems),
		} );
	}

	changeState (param, value) {
		if (typeof param == 'object'){
			this.setState(param);
		} else if (typeof param == 'string'){
			this.setState({[param]: value});
		}
	}

	getState (value) {
		return this.state[value];
	}

	getRelativePosition(event, el, hotspotsize){
		var x,y;
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

	initTooltips(){
		const {
			attributes: {
				tooltipTrigger,
				tooltipTheme,
				tooltipPlacement,
				tooltipArrow,
				tooltipAnimation,
			},
		} = this.props;

		jQuery('.tippy-popper').remove();
		

		const hotspots = jQuery(`.${baseClass}__image-wrapper .${baseClass}__hotspot`);
		// debugger;
		$.each(hotspots, function(index, val) {
			var dot = jQuery(val);
			var title = dot.find('.hotspot_title').html();
			var content = dot.find('.hotspot_content').html();
			var open = jQuery(val).data('init-open');
			var min_width = jQuery(val).data('min-width');
			var max_width = jQuery(val).data('max-width');
			var style = '';
			if (min_width !='' && min_width !='undefined') {
				style += 'min-width: ' + min_width + 'px;';
			}
			if (max_width !='' && max_width !='undefined') {
				style += 'max-width: ' + max_width + 'px;';
			}

			// debugger;

			var tooltip = tippy(val, {
				theme: tooltipTheme,
				animation: tooltipAnimation,
				animateFill: false,
				interactive: true,
				trigger: (tooltipTrigger == 'hover') ? 'mouseenter' : 'click',
				arrow: tooltipArrow,
				placement: tooltipPlacement,
				content: `<div`+ (style !='' ? ' style="'+style+'"' : '') +` class="${baseClass}__tooltip"><div class="tooltip_title">${title}</div><div class="tooltip_content">${content}</div></div>`,
				// animateFill: false,
  				// animation: 'tada', // or 'shift-toward', 'fade', ...
				// animateFill: false,
				// animation: 'fade',
				// theme: 'light-border' //google, light, light-border, translucent
			});

			
			if (open){
				setTimeout(function(){tooltip.show(); }, 1000);
				// tooltip.show();
			}
		});

	}

	initHotspotEvents(){
		const {
			attributes: {
				dotSize,
				hoverAnimation
			},
		} = this.props;

		// debugger;








		console.log('Init');

		const getRelativePosition = this.getRelativePosition;
		const updateArrValues = this.updateArrValues;
		const changeState = this.changeState;
		const getState = this.getState;
		const renderDot = this.renderDot;
		// const onDotHoverIn = this.onDotHoverIn;

		//Clear listeners		
		if (typeof jQuery(`.${baseClass}__image-wrapper .${baseClass}__hotspot`).draggable( "instance" ) !='undefined'){
			jQuery(`.${baseClass}__image-wrapper .${baseClass}__hotspot`).draggable( "destroy" );
		}
		jQuery(`.${baseClass}__image-wrapper .${baseClass}__hotspot`).off();
		jQuery(`.${baseClass}__image-wrapper`).off();

		//Remove menu
		jQuery(`.${baseClass}__image-wrapper`)[0].oncontextmenu = function() {return false;};






		// tippy(`.${baseClass}__image-wrapper .${baseClass}__hotspot`, {
		// 	content: `<div class="${baseClass}__tooltip"><div class="tooltip_title">title</div><div class="tooltip_content">Content</div></div>`,
		// 	interactive: true,
		// 	animateFill: false,
		// 	animation: 'fade',
		// 	// theme: 'light-border' //google, light, light-border, translucent
		// });







		

		jQuery(`.${baseClass}__image-wrapper .${baseClass}__hotspot`).draggable({
			start: function( event, ui ) {
				jQuery('.tippy-popper').remove();
				jQuery(`.${baseClass}__image-wrapper`).append('<div class="coords_info"><div class="x_coord"></div><div class="y_coord"></div></div>');
			},
			drag: function( event, ui ) {
				jQuery('.tippy-popper').remove();
				jQuery(`.${baseClass}__image-wrapper .x_coord`).html('x: ' + parseFloat((ui.position.left) / jQuery(`.${baseClass}__image-wrapper`).outerWidth() * 100).toFixed(2) + '%');
				jQuery(`.${baseClass}__image-wrapper .y_coord`).html('y: ' + parseFloat((ui.position.top) / jQuery(`.${baseClass}__image-wrapper`).outerHeight() * 100).toFixed(2) + '%');
			},
			cursor: "crosshair",
			containment: "parent",
			stop: function( event, ui ) {
				jQuery(`.${baseClass}__image-wrapper .coords_info`).remove();
				console.log(jQuery(this).data('point-id'));
				debugger;	
				updateArrValues( {
					position: {
						x: parseFloat((ui.position.left) / jQuery(`.${baseClass}__image-wrapper`).outerWidth() * 100).toFixed(2) + '%',
						y: parseFloat((ui.position.top) / jQuery(`.${baseClass}__image-wrapper`).outerHeight() * 100).toFixed(2) + '%'
					},
				}, jQuery(this).data('point-id') );
			},		
		});

		jQuery(`.${baseClass}__image-wrapper .${baseClass}__hotspot`).on('click', function(e){
			console.warn('CLICK');
			e.stopPropagation();
			// changeState('currentPoint', jQuery(this).data('point-id'));
		});

		jQuery(`.${baseClass}__image-wrapper .${baseClass}__hotspot`).on('mouseenter', function(e){
			if (hoverAnimation) {
				animate(jQuery(this), {
					animation: hoverAnimation
				});
			}
			// var el = jQuery(this);
			// onDotHoverIn(el);
			// console.warn('CLICK');
			// e.stopPropagation();
			// changeState('currentPoint', jQuery(this).data('point-id'));
		});




		// onMouseEnter="this.onDotHoverIn()"





		$(`.${baseClass}__image-wrapper .${baseClass}__hotspot`).mousedown(function(e){ 
			if( e.button == 2 ) { 
				console.warn('R CLICK');
				changeState('currentPoint', jQuery(this).data('point-id'));
				// alert('Right mouse button!'); 
				return true; 
			}
		}); 




		// stop: function( event, ui ) {}

		// $( ".selector" ).draggable({
		// 	containment: "parent"
		//   });

		jQuery(`.${baseClass}__image-wrapper`).on('click', function(e){
	

			if (getState('action') == 'drop'){
				var coords = getRelativePosition(e, $(this), dotSize);
				// debugger;

				// var style = '';
				// var class_name = `${baseClass}__hotspot`;
				// if (dotSize !='') {
				// 	style += 'height: ' + dotSize + 'px;width: ' + dotSize + 'px;';
				// }
				// if (dotColor !='') {
				// 	style += 'color: ' + dotColor + ';';
				// }
				// if (dotBackground !='') {
				// 	style += 'background-color: ' + dotBackground + ';';
				// }
				// if (dotPulse == true) {
				// 	class_name += ' dotpulse';
				// }						
			
				// var hotspot = `<div data-point-id="${getState('currentPoint')}" class="${class_name}" style="left: ${coords.x}; top: ${coords.y};`+ (style !='' ? style : '') +`">
				// 	<div class="inner_dot"></div>
				// 	<div class="hotspot_inner">
				// 		<div class="hotspot_title"></div>
				// 		<div class="hotspot_content"></div>
				// 	</div>
				// </div>		
				// `;
				var hotspot = renderDot(getState('currentPoint'), coords.x, coords.y );
	
				jQuery(this).append(hotspot);	

				// var hotspot = $(`<div class="${baseClass}__hotspot">`).css({
				//   left: position.x,
				//   top: hp.y,
				// });

				// $(this).append(hotspot);

				console.log(getState('currentPoint'));

				// debugger;

				updateArrValues( {
					position: {
						x: coords.x,
						y: coords.y
					},
				}, getState('currentPoint') );	

				changeState('editModal', true);
			} else {
				// debugger;
				changeState('currentPoint', null);
			}

		});
	}

	// updateDot(pointID = 0){
	// 	const {
	// 		attributes: {
	// 			imagePoints
	// 		},
	// 	} = this.props;

	// 	debugger;
	// 	const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);
	// 	if (imagePointsParsed.length){
	// 		var currentDotArr = imagePointsParsed[pointID];

	// 		debugger;



	// 	}
	// }

	renderDot(pointID = 0, coordx = 0, coordy = 0, title = '', content = '', open = false, minWidth = 100, maxWidth = 150 ){
		const {
			attributes: {
				dotSize,
				dotColor,
				dotBackground,
				dotPulse, 
			},
		} = this.props;	

		var style = '';
		var dot_style = '';
		// var class_name = `${baseClass}__hotspot`;
		if (dotSize !='') {
			style += 'height: ' + dotSize + 'px;width: ' + dotSize + 'px;';
		}
		if (dotColor !='') {
			dot_style += 'background-color: ' + dotColor + ';';
		}
		if (dotBackground !='') {
			style += 'background-color: ' + dotBackground + ';';
		}
		// if (dotPulse == true) {
		// 	class_name += ' dotpulse';
		// }						
	

		var class_name = classnames(
			`${baseClass}__hotspot`,
			{
				// 'getwid-animation': !! hoverAnimation,
				'dotpulse': !! dotPulse,
			},
		);

// debugger;

// 		const wrapperProps = {
// 			className: classnames( className,
// 				{
// 					'getwid-animation': !! hoverAnimation,
// 					'is-selected': isSelected,
// 					[`${baseClass}--dropPoint`] : (getState('action') == 'drop')
// 				},
// 			),
//             'data-animation': hoverAnimation ? hoverAnimation : undefined,
// 			onMouseEnter: (e)=>this.onDotHoverIn(),
// 		};

// `+(hoverAnimation ? ' data-animation="${hoverAnimation}" ')+`
// 		hoverAnimation




		var hotspot = `<div data-point-id="${pointID}" data-init-open="${open}" data-min-width="${minWidth}" data-max-width="${maxWidth}" class="${class_name}" style="left: ${coordx}; top: ${coordy};`+ (style !='' ? style : '') +`">
			<div`+ (dot_style !='' ? ' style="'+dot_style+'"' : '') +` class="inner_dot"></div>
			<div class="hotspot_inner">
				<div class="hotspot_title">${title}</div>
				<div class="hotspot_content">${content}</div>
			</div>
		</div>		
		`;

		return hotspot;
	}

	initDot(pointID = 0, dotObj = false){
		const renderDot = this.renderDot;
		// debugger;

		var hotspot = renderDot(pointID, dotObj['position'].x, dotObj['position'].y, dotObj['title'], dotObj['content'], dotObj['popUpOpen'], dotObj['popUpMinWidth'], dotObj['popUpMaxWidth'] );
		// var hotspot = `<div data-point-id="${pointID}" data-min-width="${dotObj['popUpMinWidth']}" data-max-width="${dotObj['popUpMaxWidth']}" class="${baseClass}__hotspot" style="left: ${dotObj['position'].x}; top: ${dotObj['position'].y};">
		// 	<div class="hotspot_inner">
		// 		<div class="hotspot_title">${dotObj['title']}</div>
		// 		<div class="hotspot_content">${dotObj['content']}</div>
		// 	</div>
		// </div>		
		// `;

		jQuery(`.${baseClass}__image-wrapper`).append(hotspot);	
	}


	initPoints(isUpdate = false){
		const {
			attributes: {
				imagePoints
			},
		} = this.props;	

		const initDot = this.initDot;
		const changeState = this.changeState;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		jQuery(`.${baseClass}__image-wrapper .${baseClass}__hotspot`).remove();
		if (imagePointsParsed.length){
			$.each(imagePointsParsed, function(index, val) {
				initDot(index, val);
			});
		}

		if (isUpdate){
			changeState('updatePoints', false);
		}

		this.initHotspotEvents();
		this.initTooltips();
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
				id: '#'+(newPoints.length + 1),
				title: '',
				content: '',
				popUpOpen: false,
				popUpMinWidth: 100,
				popUpMaxWidth: 150,
				bounce: false,
				position: {
					x: 0,
					y: 0,
				},
			}
		);

		setAttributes( {
			imagePoints: JSON.stringify(newPoints),
		} );

		changeState('currentPoint', (newPoints.length == 1) ? 0 : (newPoints.length -1));
	}

	onDeletePoint(pointID = 0) {

		// debugger;
		const {
			attributes:{
				imagePoints
			},
			setAttributes
		} = this.props;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		// const {
		// 	pointsArrTemp
		// } = this.state;

		// const getState = this.getState;
		const changeState = this.changeState;

		// debugger;

		const newItems = imagePointsParsed.filter((item, idx) => idx !== pointID);

		// debugger;
		// var newPointsArrTemp = pointsArrTemp.filter((item, idx) => idx !== pointID);

		//Fix indexes after delete items
		// $.each(newPointsArrTemp, function(index, val) {
		// 	newPointsArrTemp[index].id = index;
		// });

		// const point = pointsArrTemp[pointID];
		// marker.setMap(null);

		// changeState('currentPoint', null);
		// changeState('updatePoints', true);
		changeState({
			currentPoint: null,
			updatePoints: true
		});	

		// changeState('pointsArrTemp', newPointsArrTemp);
		setAttributes( {
			imagePoints: JSON.stringify(newItems),
		} );
	}

	onCancelPoint(){
		const {
			attributes:{
				imagePoints
			},
			setAttributes
		} = this.props;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const getState = this.getState;
		const changeState = this.changeState;

		const newItems = imagePointsParsed.filter((item, idx) => idx !== getState('currentPoint'));

		// changeState('currentPoint', null);
		// changeState('updatePoints', true);
		changeState({
			currentPoint: null,
			updatePoints: true
		});			

		setAttributes( {
			imagePoints: JSON.stringify(newItems),
		} );
	}

	render() {
		const {
			attributes: {
				imageSize,
				id,
				url,
				alt,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,

				hoverAnimation,
			},
			className,
			isSelected,
			setAttributes,
		} = this.props;

		console.warn(this.props);

		console.log('HELLO');

		const onCancelPoint = this.onCancelPoint;
		const onDeletePoint = this.onDeletePoint;
		const updateArrValues = this.updateArrValues;
		const changeState = this.changeState;
		const getState = this.getState;

		const toolbarControls = [
			{
				icon: 'location',
				title: __( 'Add point', 'getwid'),
				isDisabled: (getState('currentPoint') != null),
				isActive: (getState('action') == 'drop'),
				onClick: () =>{
					if (getState('action') != 'drop'){
						this.onAddPoint();
						changeState('action', 'drop');									
					}
				},
			},
			{
				icon: 'edit',
				title: __( 'Edit point', 'getwid'),
				isDisabled: (getState('currentPoint') === null || getState('action') == 'drop'),
				isActive: (getState('action') == 'edit' && getState('editModal') == true),
				onClick: () => {
					changeState({
						action: 'edit',
						editModal: true
					});						
					// changeState('action', 'edit');
					// changeState('editModal', true);
				},
			},
			{
				icon: 'trash',
				title: __( 'Delete point', 'getwid'),
				isDisabled: (getState('currentPoint') === null || getState('action') == 'drop'),
				onClick: () => {
					this.onDeletePoint(getState('currentPoint'));
				},
			}				
		];

		const changeImageSize = ( media, imageSize) => {
			if ( ! media ) {
				setAttributes( { url: undefined, id: undefined } );
				return;
			}

			setAttributes( {
				id: media.id,
				alt: media.alt,
				url: get( media, [ 'sizes', imageSize, 'url' ] ) || get( media, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) || media.url,
			} );
		};

		const onSelectMedia = ( media ) => {
			let {
				attributes:{
					imageSize,
				},
			} = this.props;

			if (!['full', 'large', 'medium', 'thumbnail'].includes(imageSize)) {
				imageSize = attributes.imageSize.default;
				setAttributes( {
					imageSize
				} );
			}
	
			changeImageSize(media, imageSize);
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
						<Fragment>
							<MediaUploadCheck>
								<Toolbar>
									<MediaUpload
										onSelect={ onSelectMedia }
										allowedTypes={ ALLOWED_MEDIA_TYPES }
										value={ id }
										render={ ( { open } ) => (
											<IconButton
												className="components-toolbar__control"
												label={ __( 'Edit Media', 'getwid' ) }
												icon="format-image"
												onClick={ open }
											/>
										) }
									/>
								</Toolbar>
							</MediaUploadCheck>
						</Fragment>
					) }
				</BlockControls>
			</Fragment>
		);

		const wrapperProps = {
			className: classnames( className,
				{
					// 'getwid-animation': !! hoverAnimation,
					'is-selected': isSelected,
					[`${baseClass}--dropPoint`] : (getState('action') == 'drop')
				},
			),
            'data-animation': hoverAnimation ? hoverAnimation : undefined,
			// onMouseEnter: (e)=>this.onDotHoverIn(),
		};

		const imageContainerProps = classnames(
			`${baseClass}__image-container`,
		);

		const imageHTML = url ? (<img src={ url } alt={(typeof alt != 'undefined' ? alt : null)} className= {`${baseClass}__image` }/>) : null;

		const wrapperStyle = {
			marginTop,
			marginBottom,
			marginLeft,
			marginRight
		};

		const imageWrapperProps = {
			className: classnames(
				`${baseClass}__image-wrapper`,
			),
		};

		return (
			<Fragment>
				{ controls } 
				<BlockControls>
					<Toolbar
						controls={ toolbarControls }
					/>                    
				</BlockControls>
				{ !! url && (
					<Inspector {...{
						setAttributes,
						...this.props,
						...{onCancelPoint},
						...{onDeletePoint},
						...{updateArrValues},
						...{changeImageSize},
						...{changeState},
						...{getState},
					}} key='inspector'/>					
				) }			
				<div {...wrapperProps}>
					<div style={wrapperStyle} className={imageContainerProps}>
						<div {...imageWrapperProps} >
							{imageHTML}
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	// setupHotSpot(){
	// 	const {
	// 		clientId
	// 	} = this.props;

	// 	this.imageWrapper = $(`[data-block='${clientId}'] .${baseClass}__hotspot`);
	// }

	componentDidMount(){
		// this.setupHotSpot();
		console.warn('Mount');
		this.initPoints(false);
		// this.initHotspotEvents();
	}

	componentDidUpdate(prevProps, prevState) {
		const getState = this.getState;
		const needRender = (!isEqual(this.props.attributes, prevProps.attributes)) && (isEqual(this.props.attributes.imagePoints, prevProps.attributes.imagePoints));
	
		if (needRender || getState('updatePoints') == true){
			// debugger;
			this.initPoints(true);
		}

		// this.setupHotSpot();
		console.warn('Update');


		console.log(getState('currentPoint'));


		// this.initHotspotEvents();		
	}

	// onDotHoverIn(){
	// 	// debugger;
	// 	const {
	// 		attributes: {
	// 			hoverAnimation
	// 		},
	// 	} = this.props;

	// 	if (hoverAnimation) {
	// 		animate(this.imageWrapper, {
	// 			animation: hoverAnimation
	// 		});
	// 	}
	// }

}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { id } = props.attributes;

		if (typeof id !='undefined'){
			return {
				imgObj: id ? getMedia( id ) : null,
			};
		}
	} ),
] )( Edit );