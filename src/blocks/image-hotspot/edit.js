/**
* External dependencies
*/
import classnames from 'classnames';
import animate from 'GetwidUtils/animate';
import './editor.scss';
import './style.scss'
import Inspector from './inspector';
import { merge, isEqual, get } from "lodash";


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
const { Toolbar, IconButton, Draggable, Dashicon, Panel, PanelBody } = wp.components;
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

		this.state = {
			isLockedMargins: false,
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
	
		const thisBlock = $( ReactDOM.findDOMNode( this ) );
		const hotspots = $(`.${baseClass}__image-wrapper .${baseClass}__dot` , thisBlock );
		
		$.each(hotspots, function(index, val) {
			var dot = jQuery(val);
			var title = dot.find('.hotspot_title').html();
			var content = dot.find('.hotspot_content').html();
			// var open = jQuery(val).data('init-open');
			var min_width = jQuery(val).data('min-width');
			var max_width = jQuery(val).data('max-width');
			var style = '';
			if (min_width !='' && min_width !='undefined') {
				style += 'min-width: ' + min_width + 'px;';
			}
			if (max_width !='' && max_width !='undefined') {
				style += 'max-width: ' + max_width + 'px;';
			}

			var tooltip = tippy(val, {
				hideOnClick: true,
				theme: tooltipTheme,
				animation: tooltipAnimation,
				animateFill: false,
				interactive: true,
				trigger: mouseenter,
				arrow: tooltipArrow,
				placement: tooltipPlacement,
				content: `<div`+ (style !='' ? ' style="'+style+'"' : '') +` class="${baseClass}__tooltip"><div class="tooltip_title">${title}</div><div class="tooltip_content">${content}</div></div>`,
			});
			
			// if (open){
			// 	setTimeout(function(){tooltip.show(); }, 1000);
			// }
		});

	}

	initHotspotEvents(){
		const {
			attributes: {
				dotSize,
				hoverAnimation
			},
			clientId
		} = this.props;

		const thisBlock2 = $(`[data-block='${clientId}']`);

		const getRelativePosition = this.getRelativePosition;
		const updateArrValues = this.updateArrValues;
		const changeState = this.changeState;
		const getState = this.getState;
		const renderDot = this.renderDot;

		const thisBlock = $( ReactDOM.findDOMNode( this ) );

		const imageWrapper = $(`.${baseClass}__image-wrapper` , thisBlock );
		const imageDots = $(`.${baseClass}__image-wrapper .${baseClass}__dot` , thisBlock );

		//Clear listeners		
		if (typeof imageDots.draggable( "instance" ) !='undefined'){
			imageDots.draggable( "destroy" );
		}
		imageDots.off();
		imageWrapper.off();

		//Remove menu
		imageWrapper[0].oncontextmenu = function() {return false;};
		// .droppable('destroy')
		//Drag Event
		var draggable_instance = imageDots.draggable({
			containment: "parent",	
			// scroll: false,		
			// zIndex: 2,
			// distance: 10,

			disabled: true,
			start: function( event, ui ) {
				console.warn('start DRAG');


				thisBlock.addClass(`${baseClass}--dotSelected`);
				imageDots.removeClass('selected_dot');
				jQuery(this).addClass('selected_dot');
				
				jQuery('.tippy-popper').remove();
				imageWrapper.append('<div class="coords_info"><div class="x_coord"></div><div class="y_coord"></div></div>');
			},
			drag: function( event, ui ) {
				// jQuery(thisBlock).trigger( "focus" );
				console.log('Drag!!!');
				jQuery('.tippy-popper').remove();
				jQuery(`.x_coord`, imageWrapper).html('x: ' + parseFloat((ui.position.left) / imageWrapper.outerWidth() * 100).toFixed(2) + '%');
				jQuery(`.y_coord`, imageWrapper).html('y: ' + parseFloat((ui.position.top) / imageWrapper.outerHeight() * 100).toFixed(2) + '%');
				
				// imageWrapper.focus();

				// jQuery(thisBlock2).focus();
				// jQuery(thisBlock).focus();
				// jQuery('.wp-block-getwid-image-hotspot__image-container', thisBlock).focus();
				// imageWrapper.focus();
				// jQuery('.wp-block-getwid-image-hotspot__image').focus();



				// jQuery(`[data-block='b580a2e8-7ee3-4987-b0d8-3ebbe909a810']`).focus();
				// jQuery('.wp-block-getwid-image-hotspot').focus();
				// jQuery('.wp-block-getwid-image-hotspot__image-container').focus();
				// jQuery('.wp-block-getwid-image-hotspot__image-wrapper').focus();
				// jQuery('.wp-block-getwid-image-hotspot__image').focus();




				// jQuery(`[data-block='b580a2e8-7ee3-4987-b0d8-3ebbe909a810']`).click();
				// jQuery('.wp-block-getwid-image-hotspot').click();
				// jQuery('.wp-block-getwid-image-hotspot__image-container').click();
				// jQuery('.wp-block-getwid-image-hotspot__image-wrapper').click();
				// jQuery('.wp-block-getwid-image-hotspot__image').click();




				// b580a2e8-7ee3-4987-b0d8-3ebbe909a810



				console.log(thisBlock2);
				console.log(thisBlock);
				console.log(jQuery('.wp-block-getwid-image-hotspot__image-container', thisBlock));
				console.log(imageWrapper);
				console.log(jQuery('.wp-block-getwid-image-hotspot__image'));
				// debugger;
			},
			stop: function( event, ui ) {
				// jQuery(thisBlock).trigger( "focus" );
				console.warn('stop DRAG');

				// draggable_instance.draggable( "destroy" );


			/* 	imageDots.on('dragstart', function (e) {
					// e.stopPropagation();
					// e.preventDefault();
				}); */

			/* 	imageDots.on('drag', function (e) {
					// e.stopPropagation();
					// e.preventDefault();
				}); */
				
/* 				imageDots.on('dragend', function (e) {
					console.error('END');
					// e.stopPropagation();
					// e.preventDefault();
				});	 */			


				thisBlock.removeClass(`${baseClass}--dotSelected`);
				jQuery(`.coords_info`, imageWrapper).remove();
				updateArrValues( {
					position: {
						x: parseFloat((ui.position.left) / imageWrapper.outerWidth() * 100).toFixed(2) + '%',
						y: parseFloat((ui.position.top) / imageWrapper.outerHeight() * 100).toFixed(2) + '%'
					},
				}, jQuery(this).data('point-id') );

				draggable_instance.draggable('disable');

				// return false;

				// return false;
				// draggable_instance.draggable( "destroy" );

				// jQuery(ui.helper).triggerHandler( "click" );
				// jQuery(ui.helper).trigger( "click" );


				
				// changeState('currentPoint', null);
				// debugger;
				// ui.helper.trigger( "blur" );
				// ui.helper.trigger( "click" );
				// ui.helper.triggerHandler( "click" );
				// imageWrapper.trigger( "focus" );
			},		
		});

		// if (getState('currentPoint') != null){
		// 	draggable_instance.draggable( "enable" );
		// }
		// imageDots.draggable('enable');




		// //Drag Event
		// imageDots.draggable({
		// 	containment: "parent",	
		// 	scroll: false,		
		// 	// zIndex: 2,
		// 	// distance: 10,




		// 	// start: function( event, ui ) {
		// 	// 	console.warn('start DRAG');


		// 	// 	thisBlock.addClass(`${baseClass}--dotSelected`);
		// 	// 	imageDots.removeClass('selected_dot');
		// 	// 	jQuery(this).addClass('selected_dot');
				
		// 	// 	jQuery('.tippy-popper').remove();
		// 	// 	imageWrapper.append('<div class="coords_info"><div class="x_coord"></div><div class="y_coord"></div></div>');
		// 	// },
		// 	// drag: function( event, ui ) {
		// 	// 	jQuery('.tippy-popper').remove();
		// 	// 	jQuery(`.x_coord`, imageWrapper).html('x: ' + parseFloat((ui.position.left) / imageWrapper.outerWidth() * 100).toFixed(2) + '%');
		// 	// 	jQuery(`.y_coord`, imageWrapper).html('y: ' + parseFloat((ui.position.top) / imageWrapper.outerHeight() * 100).toFixed(2) + '%');
		// 	// },
		// 	// stop: function( event, ui ) {
		// 	// 	console.warn('stop DRAG');


		// 	// 	thisBlock.removeClass(`${baseClass}--dotSelected`);
		// 	// 	jQuery(`.coords_info`, imageWrapper).remove();
		// 	// 	updateArrValues( {
		// 	// 		position: {
		// 	// 			x: parseFloat((ui.position.left) / imageWrapper.outerWidth() * 100).toFixed(2) + '%',
		// 	// 			y: parseFloat((ui.position.top) / imageWrapper.outerHeight() * 100).toFixed(2) + '%'
		// 	// 		},
		// 	// 	}, jQuery(this).data('point-id') );
		// 	// },		
		// });

		imageDots.on('stop', function (e) {
			console.error('END');
			// e.stopPropagation();
			// e.preventDefault();
		});	


		//Fix left click event
		imageDots.on('click', function(e){
			// e.stopPropagation();
			// e.preventDefault();
			console.warn('CLICK');

			// var dot = jQuery(this);
			// var drag_event = dot.draggable( "instance" );

			// debugger;

			draggable_instance.draggable( "enable" );

			


					


			imageDots.removeClass('selected_dot');
			jQuery(this).addClass('selected_dot');

			if (getState('currentPoint') == null){
				console.log(getState('currentPoint'));
				// debugger;
				changeState('currentPoint', jQuery(this).data('point-id'));
			}


		});

		//Hover Event
	/* 	imageDots.on('mouseenter', function(e){
			if (hoverAnimation) {
				animate(jQuery(this), {
					animation: hoverAnimation
				});
			}
		}); */

		//Center & Right mouse click Event
		// imageDots.mousedown(function(e){ 

			//Center (Wheel)
			// if( e.button == 1 ) { 
			// 	e.preventDefault();
			// 	changeState('currentPoint', jQuery(this).data('point-id'));
			// 	changeState({
			// 		action: 'edit',
			// 		editModal: true
			// 	});
			// 	return true; 
			// }

			//Right
			// if( e.button == 2 ) {
			// 	e.preventDefault();
			// 	imageDots.removeClass('selected_dot');
			// 	jQuery(this).addClass('selected_dot');

			// 	changeState('currentPoint', jQuery(this).data('point-id'));
			// 	return true; 
			// }
		// }); 

		//Add new point
		imageWrapper.on('click', function(e){

			if (getState('action') == 'drop'){
				var coords = getRelativePosition(e, $(this), dotSize);

				//Add blank Dot
				var hotspot = renderDot(getState('currentPoint'), coords.x, coords.y );
	
				jQuery(this).append(hotspot);	

				updateArrValues( {
					position: {
						x: coords.x,
						y: coords.y
					},
				}, getState('currentPoint') );	

				changeState('editModal', true);
			} else {
				debugger;
				if (e.target == jQuery(`.${baseClass}__image`, jQuery(this))[0]){
					debugger;
					draggable_instance.draggable('disable');
					changeState('currentPoint', null);

				}


				//Remove selection
				// imageDots.draggable('disable');
			}
	
		});
	}

	renderDot(pointID = 0, coordx = 0, coordy = 0, title = '', link = '', newTab = false, content = '', open = false, minWidth = 100, maxWidth = 150 ){
		const {
			attributes: {
				dotSize,
				dotColor,
				dotBackground,
				dotOpacity,
				dotPulse, 
			},
		} = this.props;	

		var style = '';
		var dot_style = '';

		if (dotSize) {
			style += 'height: ' + dotSize + 'px;width: ' + dotSize + 'px;';
		}
		if (dotColor) {
			dot_style += 'background-color: ' + dotColor + ';';
		}
		if (dotBackground) {
			style += 'background-color: ' + dotBackground + ';';
		}
		if (dotOpacity) {
			style += 'opacity: ' + (dotOpacity/100) + ';';
		}		

		var class_name = classnames(
			`${baseClass}__dot`,
			{
				'dotpulse': !! dotPulse,
			},
		);

		var link_HTML = '';
		if (link !=''){
			link_HTML = `<a href="${link}"`+(newTab ? ' target="_blank" rel="noopener noreferrer"' : '')+`>${title}</a>`
		} else {
			link_HTML = title;
		}

		//Dot HTML
		var hotspot = `<div data-point-id="${pointID}" data-init-open="${open}" data-min-width="${minWidth}" data-max-width="${maxWidth}" class="${class_name}" style="left: ${coordx}; top: ${coordy};`+ (style !='' ? style : '') +`">
			<div`+ (dot_style !='' ? ' style="'+dot_style+'"' : '') +` class="inner_dot"></div>
			<div class="hotspot_inner">
				<div class="hotspot_title">${link_HTML}</div>
				<div class="hotspot_content">${content}</div>
			</div>
		</div>		
		`;

		return hotspot;
	}

	initDot(pointID = 0, dotObj = false){
		const renderDot = this.renderDot;

		var hotspot = renderDot(pointID, dotObj['position'].x, dotObj['position'].y, dotObj['title'], dotObj['link'], dotObj['newTab'], dotObj['content'], dotObj['popUpOpen'], dotObj['popUpMinWidth'], dotObj['popUpMaxWidth'] );

		const thisBlock = $( ReactDOM.findDOMNode( this ) );
		const imageWrapper = $(`.${baseClass}__image-wrapper` , thisBlock );

		imageWrapper.append(hotspot);	
	}

	//Events & tooltips
	initPoints(isUpdate = false){
		const {
			attributes: {
				imagePoints
			},
		} = this.props;	

		const initDot = this.initDot;
		const changeState = this.changeState;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const thisBlock = $( ReactDOM.findDOMNode( this ) );
		const imageDots = $(`.${baseClass}__image-wrapper .${baseClass}__dot` , thisBlock );

		imageDots.remove();
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
				title: '',
				link: '',
				newTab: false,
				content: '',
				popUpOpen: false,
				popUpMinWidth: 100,
				popUpMaxWidth: 150,
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
		const {
			attributes:{
				imagePoints
			},
			setAttributes
		} = this.props;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const changeState = this.changeState;

		const newItems = imagePointsParsed.filter((item, idx) => idx !== pointID);

		changeState({
			currentPoint: null,
			updatePoints: true
		});	

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
				id,
				url,
				alt,

				hoverAnimation,
			},
			className,
			isSelected,
			setAttributes,
		} = this.props;

		console.log(this.props);

		const onCancelPoint = this.onCancelPoint;
		const onDeletePoint = this.onDeletePoint;
		const updateArrValues = this.updateArrValues;
		const changeState = this.changeState;
		const getState = this.getState;
		const { isLockedMargins } = this.state;

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
					'is-selected': isSelected,
					[`${baseClass}--dotSelected`] : (getState('currentPoint') != null),
					[`${baseClass}--dropPoint`] : (getState('action') == 'drop')
				},
			),
		};

		const imageContainerProps = classnames(
			`${baseClass}__image-container`,
		);

		const imageHTML = url ? (<img src={ url } alt={(typeof alt != 'undefined' ? alt : null)} className= {`${baseClass}__image` }/>) : null;

		const imageWrapperProps = {
			className: classnames(
				`${baseClass}__image-wrapper`,
			),
		};

		return (
			<Fragment>
				<div {...wrapperProps}>
					{ controls } 
					<BlockControls>
						<Toolbar
							controls={ toolbarControls }
						/>                    
					</BlockControls>




	<div id="draggable-panel">
		<Panel header="Draggable panel" >
			<PanelBody>
				<Draggable
					elementId="draggable-panel"
					transferData={ { } }
					onDragStart={() =>{
						console.log('onDragStart');
					}}
					onDragEnd={() =>{
						console.log('onDragEnd');
					}}
				>
				{
					( { onDraggableStart, onDraggableEnd } ) => (
						<div
							icon="move"
							onDragStart={() =>{
								console.log('onDraggableStart');
							}}
							onDragEnd={() =>{
								console.log('onDraggableEnd');
							}}
							draggable
						/>
					)
				}
				</Draggable>
			</PanelBody>
		</Panel>
	</div>








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
							...{isLockedMargins},
						}} key='inspector'/>
					) }			
					<div className={imageContainerProps}>
						<div {...imageWrapperProps} >
							{imageHTML}
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	componentDidMount(){
		this.initPoints(false);
	}

	componentDidUpdate(prevProps, prevState) {
		const getState = this.getState;
		const needRender = (!isEqual(this.props.attributes, prevProps.attributes)) && (isEqual(this.props.attributes.imagePoints, prevProps.attributes.imagePoints));
	
		if (needRender || getState('updatePoints') == true){
			this.initPoints(true);
		}
	}

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