/**
* External dependencies
*/
import { merge, isEqual } from "lodash";
import classnames from 'classnames';
import Inspector from './inspector';
import './editor.scss';


/**
* WordPress dependencies
*/
const {
	Component,
	Fragment,
	createRef
} = wp.element;
const {
	BlockControls,
	BlockAlignmentToolbar,
} = wp.blockEditor || wp.editor;
const {
	Button,
	ToolbarGroup,
	TextControl,
} = wp.components;
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { safeHTML } = wp.dom;
const { decodeEntities } = wp.htmlEntities;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-map';


/**
* Create an Component
*/
class Edit extends Component {

	constructor(props) {

		super( ...arguments );

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);
		this.updateArrValues = this.updateArrValues.bind(this);
		this.initMapEvents = this.initMapEvents.bind(this);
		this.initMarkers = this.initMarkers.bind(this);
		this.mapStyles = this.mapStyles.bind(this);
		this.cancelMarker = this.cancelMarker.bind(this);
		this.onDeleteMarker = this.onDeleteMarker.bind(this);
		this.manageGoogleAPIKey = this.manageGoogleAPIKey.bind(this);
		this.removeGoogleAPIScript = this.removeGoogleAPIScript.bind(this);

		this.mapRef = createRef();

		this.state = {
			currentMarker: null,
			googleApiKey : Getwid.settings.google_api_key != '' ? Getwid.settings.google_api_key : '',
			checkApiKey : Getwid.settings.google_api_key != '' ? Getwid.settings.google_api_key : '',
			mapObj: {},
			markerArrTemp: [],
			action: false,
			editModal: false,
			firstInit: true,
			readyState: false,
		};
	}

	updateArrValues( value, index ) {

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
	};

	addGoogleAPIScript() {
		const changeState = this.changeState;
		const getState = this.getState;

		const currentDocument = this.mapRef.current.ownerDocument;

		function addScript(src, key)
		{
		    var script = currentDocument.createElement("script");
		    script.type = "text/javascript";
		    script.src =  src+key;
		    script.id = "google_api_js";

			currentDocument.getElementsByTagName('head')[0].appendChild(script);

		    script.onload = script.onreadystatechange = function() {

		        if ( ! getState('readyState') ) {

		            script.onload = script.onreadystatechange = null;
		            changeState('readyState', true);
		        }
		    };
		}

		if ( $( currentDocument ).find( '#google_api_js' ).length ) {

			changeState('readyState', true);
		} else {

			addScript("https://maps.googleapis.com/maps/api/js?key=", Getwid.settings.google_api_key);
		}
	}

	removeGoogleAPIScript() {
		const currentDocument = this.mapRef.current.ownerDocument;
		const main_google_js = $( currentDocument ).find( '#google_api_js' );

		if (main_google_js.length){
			main_google_js.remove();
		}

		const other_google_js = $( currentDocument ).find( "script[src*='maps.googleapis.com']" );

		if (other_google_js.length){
			$.each(other_google_js, function(index, val) {
				$(val).remove();
			});
		}

		window.google = {};
	}

	manageGoogleAPIKey(event, option) {
		event.preventDefault();

		const data = {
			'action': 'get_google_api_key',
			'data': this.getState('checkApiKey'),
			'option': option,
			'nonce': Getwid.nonces.google_api_key
		};

		if (option == 'set'){
			Getwid.settings.google_api_key = this.getState('checkApiKey');
			this.addGoogleAPIScript();
		} else if (option == 'delete'){
			Getwid.settings.google_api_key = '';
		}

		jQuery.post(Getwid.ajax_url, data, function(response) {});
	}

	enterGoogleAPIKeyForm() {
		return (
			<form className={`${baseClass}__key-form`} onSubmit={ event => this.manageGoogleAPIKey(event, 'set')}>
				<span className={'form-title'}>{__('Google Maps API key.', 'getwid')} <a href="https://developers.google.com/maps/documentation/embed/get-api-key" target="_blank">{__('Get your key.', 'getwid')}</a></span>

				<div className={'form-wrapper'}>
					<TextControl
						placeholder={__('Google Maps API Key', 'getwid')}
						onChange={ value => this.changeState('checkApiKey', value) }
					/>

					<Button
						isPrimary
						type="submit"
						disabled={((this.getState('checkApiKey') != '') ? null : true)}
					>
						{__('Save API Key', 'getwid')}
					</Button>
				</div>
				<div ref={ this.mapRef }></div>
			</form>
		);
	}

	mapStyles(){
		const {
			attributes: {
				mapStyle,
				customStyle
			},
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
	}

	//Map
	initMap(refresh = false, prevProps) {

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
			clientId,
			className,
			setAttributes
		} = this.props;

		const currentWindow = this.mapRef.current.ownerDocument.defaultView;
		const mapMarkersParsed = (mapMarkers != '' ? JSON.parse(mapMarkers) : []);
		const mapCenterChange = !isEqual(this.props.attributes.mapCenter, prevProps.attributes.mapCenter)

		const initMapEvents = this.initMapEvents;
		const initMarkers = this.initMarkers;
		const onDeleteMarker = this.onDeleteMarker;
		const changeState = this.changeState;
		const getState = this.getState;
		const mapStyles = this.mapStyles;

		let googleMap;

		if ( getState('firstInit') == true && getState('readyState') == true ) {

			clearInterval(this.waitLoadGoogle);
			this.waitLoadGoogle = setInterval( () => {

			  if ( typeof currentWindow.google != 'undefined' ) {

				clearInterval(this.waitLoadGoogle);

				const thisBlock = $( this.mapRef.current );
				const mapSelector = $( `.${baseClass}__container`, thisBlock )[0];

				thisBlock.on('keydown', function( event ) {
				    const { keyCode } = event;

				    //Delete Key
				    if ( keyCode === 46 && getState('currentMarker') !== null && getState('action') != 'drop') {
				    	if(confirm(__('Delete Marker', 'getwid'))){
				    		onDeleteMarker(getState('currentMarker'));
				    	}
				    }

				});

				googleMap = new currentWindow.google.maps.Map(mapSelector, {
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
			  }
			}, 100);

		} else {

			googleMap = getState('mapObj');

			if ( googleMap ) {
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
		}

	}

	initMapEvents(googleMap){
		const {
			setAttributes
		} = this.props;

		const updateArrValues = this.updateArrValues;
		const changeState = this.changeState;
		const getState = this.getState;

		const currentWindow = this.mapRef.current.ownerDocument.defaultView;

		const geocoder = new currentWindow.google.maps.Geocoder;
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
								description: results[0].formatted_address,
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

	}

	cancelMarker(){
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
	}

	//Markers
	initMarkers(firstInit = false, refreshMarker = false, markerID = 0, googleMap = false) {
		const {
			attributes: {
				mapMarkers
			},
			className
		} = this.props;

		const {
			markerArrTemp
		} = this.state;

		const currentWindow = this.mapRef.current.ownerDocument.defaultView;
		const mapMarkersParsed = (mapMarkers != '' ? JSON.parse(mapMarkers) : []);
		const latLng = mapMarkersParsed[markerID].coords;

		let marker;

		if (refreshMarker == false) {
			marker = new currentWindow.google.maps.Marker({
				id: markerID,
				position: latLng,
				map: googleMap,
				draggable: true,
				animation: firstInit ? currentWindow.google.maps.Animation.DROP : null,
			});

			markerArrTemp.push(marker);

			if (mapMarkersParsed[markerID].bounce){
				setTimeout(function(){marker.setAnimation(currentWindow.google.maps.Animation.BOUNCE); }, 2000);
			}

		} else {
			marker = markerArrTemp[markerID];
			marker.setPosition( latLng );
		}

		let message = '';
		const markerDescription = safeHTML( decodeEntities( mapMarkersParsed[markerID].description ) );
		if ( markerDescription != '') {
			message = `
				<div class='getwid-poi-info-window'>
					${markerDescription}
				</div>
			`;
		}

		this.attachMessage(markerID, marker, message, (mapMarkersParsed[ markerID ].popUpOpen), mapMarkersParsed[markerID].popUpMaxWidth, refreshMarker);
	}

	//Pop-up messages
	attachMessage(markerID, marker, message, opened, maxWidth, refreshMarker) {
		const {
			className,
			setAttributes
		} = this.props;

		const getState = this.getState;
		const changeState = this.changeState;
		const updateArrValues = this.updateArrValues;
		const currentWindow = this.mapRef.current.ownerDocument.defaultView;

		let popUp;

		if (refreshMarker == false) {
			popUp = new currentWindow.google.maps.InfoWindow({
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
			if (popUp.content !=''){
				popUp.open(marker.get('map'), marker);
			}
			changeState('currentMarker', marker.id);
		});

		marker.addListener('rightclick', function() {

			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
				updateArrValues( {
					bounce: false
				}, marker.id );
			} else {
				marker.setAnimation(currentWindow.google.maps.Animation.BOUNCE);
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

	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	componentWillUnmount() {
		clearInterval(this.waitLoadGoogle);
	}

	componentDidMount() {

		if ( this.getState('googleApiKey') != '' ){
			this.addGoogleAPIScript();
		}
	}

	componentDidUpdate(prevProps, prevState) {

		const {
			attributes: {
				mapMarkers: prevItems,
			}
		} = prevProps;

		const allowRender =
			( this.state.firstInit == true && this.state.readyState == true ) ||
			( ! isEqual(this.props.attributes, prevProps.attributes) );

		if ( Getwid.settings.google_api_key != '' && allowRender ) {
			this.initMap(!!prevItems.length, prevProps );
		}
	}

	onAddMarker() {
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
	}

	onDeleteMarker(markerID = 0) {
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
	}

	render() {

		if (Getwid.settings.google_api_key == ''){
			return this.enterGoogleAPIKeyForm();
		}

		const {
			attributes:
			{
				mapHeight,
				mapCenter,
				mapZoom,
				interaction,
				zoomControl,
				mapTypeControl,
				streetViewControl,
				fullscreenControl,
				mapStyle,
				customStyle,
				blockAlignment,
				mapMarkers,
			},
			className,
			setAttributes
		} = this.props;

		const initMarkers = this.initMarkers;
		const cancelMarker = this.cancelMarker;
		const onDeleteMarker = this.onDeleteMarker;
		const updateArrValues = this.updateArrValues;
		const changeState = this.changeState;
		const getState = this.getState;
		const manageGoogleAPIKey = this.manageGoogleAPIKey;
		const removeGoogleAPIScript = this.removeGoogleAPIScript;

		const wrapperClass = classnames(
			className,
			{
				[`${baseClass}--dropMarker`] : (getState('action') == 'drop')
			}
		);

		return (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'wide', 'full' ] }
						onChange={ value => setAttributes( { blockAlignment: value } ) }
					/>
					<ToolbarGroup controls={[
						{
							icon: 'location',
							title: __('Drop Marker', 'getwid'),
							isDisabled: (getState('currentMarker') != null),
							isActive: (getState('action') == 'drop'),
							onClick: () => {
								if (getState('action') != 'drop'){
									this.onAddMarker();
									changeState('action', 'drop');
								}
							}
						},
						{
							icon: 'edit',
							title: __('Edit Marker', 'getwid'),
							isDisabled: (getState('currentMarker') === null || getState('action') == 'drop'),
							isActive: (getState('action') == 'edit' && getState('editModal') == true),
							onClick: () => {
								changeState('action', 'edit');
								changeState('editModal', true);
							},
						},
						{
							icon: 'trash',
							title: __('Delete Marker', 'getwid'),
							isDisabled: (getState('currentMarker') === null || getState('action') == 'drop'),
							onClick: () => {
								this.onDeleteMarker(getState('currentMarker'));
							}
						},
					]}/>

				</BlockControls>
				<Inspector
					{ ...{
						...this.props,
						initMarkers,
						cancelMarker,
						onDeleteMarker,
						updateArrValues,
						changeState,
						getState,
						manageGoogleAPIKey,
						removeGoogleAPIScript
					} }
				/>

				<div className={wrapperClass} ref={ this.mapRef }>
					<div style={{height: mapHeight + 'px'}} className={`${baseClass}__container`}></div>
				</div>

			</Fragment>
		);
	}
}
export default ( Edit );
