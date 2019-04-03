/**
* External dependencies
*/
import { merge, isEqual, escape, unescape } from "lodash";
import classnames from 'classnames';
import stylesArr from 'GetwidUtils/map-styles';
import Inspector from './inspector';
import './editor.scss';


/**
* WordPress dependencies
*/
const {
	Component,
	Fragment,
} = wp.element;
const {
	BlockControls,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	Button,
	Toolbar,
	TextControl,
	ServerSideRender,
	Disabled	
} = wp.components;
const { __, sprintf } = wp.i18n;


/**
* Create an Component
*/
class Edit extends Component {
	constructor(props) {

		super( ...arguments );

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);
		// this.updateArrValues = this.updateArrValues.bind(this);
		// this.initMapEvents = this.initMapEvents.bind(this);
		// this.initMarkers = this.initMarkers.bind(this);
		// this.mapStyles = this.mapStyles.bind(this);
		// this.cancelMarker = this.cancelMarker.bind(this);
		// this.onDeleteMarker = this.onDeleteMarker.bind(this);
		this.manageInstagramToken = this.manageInstagramToken.bind(this);
		this.removeInstagramToken = this.removeInstagramToken.bind(this);

		this.state = {
			// currentMarker: null,
			instagramToken : Getwid.settings.instagram_token != '' ? Getwid.settings.instagram_token : '',
			checkToken : Getwid.settings.instagram_token != '' ? Getwid.settings.instagram_token : '',
			instagramObj: undefined
			// mapObj: {},
			// markerArrTemp: [],
			// action: false,
			// editModal: false,
			// firstInit: true,
		};

		console.warn(Getwid.settings.instagram_token);
	}

	getInstagramData() {
		const {
			attributes: {
				getDataFrom,
				userName,
				tagName,
				photoCount,
				displayStyle,
				gridColumns,
				linkTo,
				showLikes,
				showComments,
				align,
			},
			className,
			setAttributes
		} = this.props;
		const changeState = this.changeState;

		$.get( "https://api.instagram.com/v1/users/7705691465/media/recent?access_token="+Getwid.settings.instagram_token, function( data ) {
			console.log(data);
			// changeState('instagramObj', data);
		});
	}


/* 	updateArrValues ( value, index ) {

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
		const { mapMarkers } = attributes;

		const mapMarkersParsed = (mapMarkers != '' ? JSON.parse(mapMarkers) : []);

		const newItems = mapMarkersParsed.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				// item = jQuery.extend(true, {}, item, value);
				item = merge(item, value);
			}
			return item;
		} );

		setAttributes( {
			mapMarkers: JSON.stringify(newItems),
		} );
	}; */

/* 	addGoogleAPIScript() {
		const changeState = this.changeState;
		const getState = this.getState;

		function addScript(src, key)
		{
		    var script = document.createElement("script");
		    script.type = "text/javascript";
		    script.src =  src+key;
		    script.id = "google_api_js";
		    var done = false;
		    document.getElementsByTagName('head')[0].appendChild(script);
		
		    script.onload = script.onreadystatechange = function() {
		        if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") )
		        {
		            done = true;
		            script.onload = script.onreadystatechange = null;
		            loaded(key);
		        }
		    };
		}
		
		function loaded(key){
			changeState('firstInit', true);
		}

		if ($('#google_api_js').length){
			changeState('firstInit', true);
		} else {
			addScript("https://maps.googleapis.com/maps/api/js?key=", Getwid.settings.instagram_token);
		}
	} */

	removeInstagramToken() {
		const main_google_js = $('#google_api_js');

		if (main_google_js.length){
			main_google_js.remove();
		}

		const other_google_js = $("script[src*='maps.googleapis.com']");

		if (other_google_js.length){
			$.each(other_google_js, function(index, val) {
				$(val).remove();
			});
		}

		window.google = {};
	}

	manageInstagramToken(event, option) {
		event.preventDefault();

		const data = {
			'action': 'getwid_instagram_token',
			'data': this.getState('checkToken'),
			'option': option,
			// 'nonce': Getwid.nonces.instagram_token
		};

		if (option == 'set'){
			Getwid.settings.instagram_token = this.getState('checkToken');
			// this.addGoogleAPIScript();
		} else if (option == 'delete'){
			Getwid.settings.instagram_token = '';
		}

		jQuery.post(Getwid.ajax_url, data, function(response) {});
	}

	enterInstagramTokenForm() {
		return (
			<form className={`${this.props.className}__key-form`} onSubmit={ event => this.manageInstagramToken(event, 'set')}>
				<span className={'form-title'}>{__('Instagram Access token.', 'getwid')} <a href="https://www.instagram.com/developer/authentication/" target="_blank">{__('Get your key.', 'getwid')}</a></span>
				
				<div className={'form-wrapper'}>
					<TextControl
						placeholder={__('Instagram Access token', 'getwid')}
						onChange={ value => this.changeState('checkToken', value) }
					/>

					<Button
						isPrimary
						type="submit"
						disabled={((this.getState('checkToken') != '') ? null : true)}	
					>
						{__('Save API Key', 'getwid')}
					</Button>
				</div>
			</form>
		);
	}

/* 	mapStyles (){
		const {
			attributes: {
				mapStyle,
				customStyle
			},
			className,
			setAttributes
		} = this.props;

		if (typeof mapStyle != 'object'){
			if (mapStyle == 'custom'){
				try {
				    return eval(customStyle)
				} catch (e) {
				    if (e instanceof SyntaxError) {
				        console.error(e.message);
				    } else {
				        throw( e );
				    }
				}
			} else {
				return stylesArr[mapStyle];
			}
		} else {
			return null;
		}
	} */

	//Map
/* 	initMap (refresh = false, prevProps) {
		const {
			attributes: {
				mapCenter,
				mapZoom,
				interaction,
				zoomControl,
				mapTypeControl,
				streetViewControl,
				fullscreenControl,
				mapMarkers,
			},
			className,
			setAttributes
		} = this.props;

		const mapMarkersParsed = (mapMarkers != '' ? JSON.parse(mapMarkers) : []);

		const mapCenterChange = !isEqual(this.props.attributes.mapCenter, prevProps.attributes.mapCenter)

		const initMapEvents = this.initMapEvents;		
		const initMarkers = this.initMarkers;
		const onDeleteMarker = this.onDeleteMarker;		
		const changeState = this.changeState;
		const getState = this.getState;
		const mapStyles = this.mapStyles;

		let googleMap;

		if (this.getState('firstInit') == true ){

			var waitLoadGoogle = setInterval( () => {
			  if (typeof google != 'undefined'){
				const mapEl = $(ReactDOM.findDOMNode(this));
				const mapSelector = $(`.${className}__container`, mapEl)[0];

				mapEl.on('keydown', function( event ) {
				    const { keyCode } = event;

				    //Delete Key
				    if ( keyCode === 46 && getState('currentMarker') !== null && getState('action') != 'drop') {
				    	if(confirm("Delete Marker ?")){
				    		onDeleteMarker(getState('currentMarker'));
				    	}
				    }

				});

				googleMap = new google.maps.Map(mapSelector, {
					center: mapCenter,
					styles: mapStyles(),
					gestureHandling: 'cooperative', //interaction Disable this param for back-end
					zoomControl: zoomControl,
					mapTypeControl: mapTypeControl,
					streetViewControl: streetViewControl,
					fullscreenControl: fullscreenControl,
					zoom: mapZoom
				});

				this.setState({
					mapObj : googleMap,
					firstInit : false,
				});

				if (mapMarkersParsed.length){
					$.each(mapMarkersParsed, function(index, val) {
						initMarkers(true, false, index, googleMap);
					});
				}

				//Events
				initMapEvents(googleMap);

				clearInterval(waitLoadGoogle);
			  }
			}, 1);

		} else {
			googleMap = this.getState('mapObj');
			googleMap.setOptions({
				styles: mapStyles(),
				zoomControl: zoomControl,
				mapTypeControl: mapTypeControl,
				streetViewControl: streetViewControl,
				fullscreenControl: fullscreenControl		
			});

			if (mapCenterChange){
				googleMap.panTo(mapCenter);
			}
		}

	} */

	/* initMapEvents(googleMap){
		const {
			setAttributes
		} = this.props;

		const updateArrValues = this.updateArrValues;
		const changeState = this.changeState;
		const getState = this.getState;

		const geocoder = new google.maps.Geocoder;
		// google.maps.event.clearListeners(googleMap, 'click');
		googleMap.addListener('click', function(event) {
			if (getState('action') == 'drop'){

				const latLng = {
					lat: event.latLng.lat(),
					lng: event.latLng.lng()
				};

				geocoder.geocode({'location': latLng}, function(results, status) {
					if (status === 'OK') {
						if (results[0]) {
							updateArrValues( {
								description: escape(results[0].formatted_address),
							}, getState('currentMarker') );							
						}
					}
				});

				updateArrValues( {
					coords: latLng,
				}, getState('currentMarker') );

				changeState('editModal', true);
			} else {
				changeState('currentMarker', null);
			}
		});

		// google.maps.event.clearListeners(googleMap, 'zoom_changed');
		googleMap.addListener('zoom_changed', function(event) {

			setAttributes({
				mapZoom: googleMap.getZoom(),
			});

		});

		// google.maps.event.clearListeners(googleMap, 'dragend');
		googleMap.addListener('dragend', function(event) {	

			setAttributes({
				mapCenter: {
					lat: googleMap.getCenter().lat(),
					lng: googleMap.getCenter().lng()
				},
			});

		}); 

	} */

/* 	cancelMarker(){
		const {
			attributes:{
				mapMarkers
			},
			setAttributes
		} = this.props;

		const mapMarkersParsed = (mapMarkers != '' ? JSON.parse(mapMarkers) : []);

		const getState = this.getState;
		const changeState = this.changeState;

		const newItems = mapMarkersParsed.filter((item, idx) => idx !== getState('currentMarker'));

		changeState('currentMarker', null);

		setAttributes( {
			mapMarkers: JSON.stringify(newItems),
		} );
	} */

	//Markers
/* 	initMarkers(firstInit = false, refreshMarker = false, markerID = 0, googleMap = false) {
		const {
			attributes: {
				mapMarkers
			},
			className
		} = this.props;

		const {
			markerArrTemp
		} = this.state;

		const mapMarkersParsed = (mapMarkers != '' ? JSON.parse(mapMarkers) : []);

		const latLng = mapMarkersParsed[markerID].coords;

		let marker;

		if (refreshMarker == false) {
			marker = new google.maps.Marker({
				id: markerID,
				position: latLng,
				map: googleMap,
				draggable: true,
				animation: firstInit ? google.maps.Animation.DROP : null,
			});

			markerArrTemp.push(marker);

			if (mapMarkersParsed[markerID].bounce){			
				setTimeout(function(){marker.setAnimation(google.maps.Animation.BOUNCE); }, 2000);
			}

		} else {
			marker = markerArrTemp[markerID];
			marker.setPosition( latLng );
		}

		var message = `
			<div class='getwid-poi-info-window'>
				${unescape(mapMarkersParsed[markerID].description)}
			</div>
		`;

		this.attachMessage(markerID, marker, message, (mapMarkersParsed[ markerID ].popUpOpen), mapMarkersParsed[markerID].popUpMaxWidth, refreshMarker);
	} */

	//Pop-up messages
/* 	attachMessage(markerID, marker, message, opened, maxWidth, refreshMarker) {
		const {
			className,
			setAttributes
		} = this.props;

		const getState = this.getState;
		const changeState = this.changeState;
		const updateArrValues = this.updateArrValues;

		let popUp;

		if (refreshMarker == false) {
			popUp = new google.maps.InfoWindow({
				content: message,
				maxWidth: maxWidth
			});

			marker.popUp = popUp;
		} else {
			popUp = marker.popUp;
			popUp.setContent(message);
			popUp.setOptions({maxWidth:maxWidth});
		}		

		if (refreshMarker){
			popUp.close();
		}

		if (opened){
			popUp.open(marker.get('map'), marker);
		}

		// google.maps.event.clearInstanceListeners(marker);
		marker.addListener('click', function() {
			popUp.open(marker.get('map'), marker);
			changeState('currentMarker', marker.id);
		});

		marker.addListener('rightclick', function() {

			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
				updateArrValues( {
					bounce: false
				}, marker.id );
			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				updateArrValues( {
					bounce: true
				}, marker.id );
			}

		});

		marker.addListener('dragend', function(event) {

			updateArrValues( {
				coords: {
					lat: event.latLng.lat(),
					lng: event.latLng.lng()
				}
			}, marker.id );

		});

	} */

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	componentDidMount() {
		if (this.getState('instagramToken') != ''){
			// this.addGoogleAPIScript();
			this.getInstagramData();
		}
	}

	componentDidUpdate(prevProps, prevState) {
/* 		const {
			attributes: {
				mapMarkers: prevItems,
			}
		} = prevProps; */

		const allowRender = 
			// this.state.firstInit == true ||
			(!isEqual(this.props.attributes, prevProps.attributes));

		if (Getwid.settings.instagram_token != '' && allowRender){
			// this.initMap(!!prevItems.length, prevProps );
		}
	}

/* 	onAddMarker() {
		const {
			attributes: {
				mapMarkers
			},
			setAttributes,
		} = this.props;

		const mapMarkersParsed = (mapMarkers != '' ? JSON.parse(mapMarkers) : []);

		const newMarkers = mapMarkersParsed;
		const changeState = this.changeState;

		newMarkers.push(
			{
				name: '#'+(newMarkers.length + 1),
				description: '',
				popUpOpen: false,
				popUpMaxWidth: 250,
				bounce: false,
				coords: {
					lat: 0,
					lng: 0,
				},
			}
		);

		setAttributes( {
			mapMarkers: JSON.stringify(newMarkers),
		} );

		changeState('currentMarker', (newMarkers.length == 1) ? 0 : (newMarkers.length -1));
	} */

/* 	onDeleteMarker(markerID = 0) {
		const {
			attributes:{
				mapMarkers
			},
			setAttributes
		} = this.props;

		const mapMarkersParsed = (mapMarkers != '' ? JSON.parse(mapMarkers) : []);

		const {
			markerArrTemp
		} = this.state;

		const getState = this.getState;
		const changeState = this.changeState;

		const newItems = mapMarkersParsed.filter((item, idx) => idx !== markerID);
		var newMarkerArrTemp = markerArrTemp.filter((item, idx) => idx !== markerID);

		//Fix indexes after delete items
		$.each(newMarkerArrTemp, function(index, val) {
			newMarkerArrTemp[index].id = index;
		});

		const marker = markerArrTemp[markerID];
		marker.setMap(null);

		changeState('currentMarker', null);
		changeState('markerArrTemp', newMarkerArrTemp);
		setAttributes( {
			mapMarkers: JSON.stringify(newItems),
		} );
	} */

	render() {

		if (Getwid.settings.instagram_token == ''){
			return this.enterInstagramTokenForm();
		}

		const {
			attributes:
			{
				getDataFrom,
				userName,
				tagName,
				photoCount,
				displayStyle,
				gridColumns,
				linkTo,
				showLikes,
				showComments,
				align,
			},
			className,
			setAttributes
		} = this.props;

	/* 	const {
			instagramObj
		} = this.state; */

		// const initMarkers = this.initMarkers;
		// const cancelMarker = this.cancelMarker;
		// const onDeleteMarker = this.onDeleteMarker;
		// const updateArrValues = this.updateArrValues;
		const changeState = this.changeState;
		const getState = this.getState;
		const manageInstagramToken = this.manageInstagramToken;
		const removeInstagramToken = this.removeInstagramToken;

	/* 	const wrapperClass = classnames( className,
			{
				[`${className}--grid`] : displayStyle == 'grid',
				[`${className}--columns-${gridColumns}`] : (displayStyle == 'grid' && gridColumns !=0)
			}
		); */

		// const instagramObj = getState('instagramObj');

	
		return (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						controls={ [ 'wide', 'full' ] }
						onChange={ value => setAttributes( { align: value } ) }
					/>
				</BlockControls>
				<Inspector {...{
					...this.props,
					// ...{initMarkers},
					// ...{cancelMarker},
					// ...{onDeleteMarker},
					// ...{updateArrValues},
					...{changeState},
					...{getState},
					...{manageInstagramToken},
					...{removeInstagramToken},
				}} key='inspector'/>

				<Disabled>
					<ServerSideRender
						block="getwid/instagram"
						attributes={this.props.attributes}
					/>
				</Disabled>

			</Fragment>
		);

	}
}
export default ( Edit );