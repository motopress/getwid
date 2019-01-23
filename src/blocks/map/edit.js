import { merge, isEqual } from "lodash";
import classnames from 'classnames';
// import stylesArr from './map-styles';
import Inspector from './inspector';

import './editor.scss';

const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	InspectorControls,
	ColorPalette,
	RichText,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	IconButton,
	Dashicon,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	DropdownMenu,
	Toolbar,
	TextControl,
} = wp.components;

const { __, sprintf } = wp.i18n;

class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);
		this.updateArrValues = this.updateArrValues.bind(this);
		this.initMapEvents = this.initMapEvents.bind(this);
		this.initMarkers = this.initMarkers.bind(this);
		this.mapStyles = this.mapStyles.bind(this);
		this.cancelMarker = this.cancelMarker.bind(this);
		this.onDeleteMarker = this.onDeleteMarker.bind(this);

		this.state = {
			currentMarker: null,
			mapLoaded: false,
			googleApiKey : Getwid.settings.google_api_key != '' ? Getwid.settings.google_api_key : '',
			checkApiKey : '',
			mapObj: {},
			markerArrTemp: [],
			action: false,
			editModal: false,
			firstInit: true,
		};
	}

	create_markers_UUID(){
	    var dt = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (dt + Math.random()*16)%16 | 0;
	        dt = Math.floor(dt/16);
	        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	}

	key_in_array(array, value)
	{
	    for(var i = 0; i < array.length; i++) 
	    {
	        if(array[i].uuID == value) return i;
	    }
	    return false;
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
		const { markersArrays } = attributes;

		const newItems = markersArrays.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				// item = jQuery.extend(true, {}, item, value);
				item = merge(item, value);
			}
			return item;
		} );

		setAttributes( {
			markersArrays: newItems,
		} );
	};

	addGoogleAPIScript() {
		const changeState = this.changeState;

		function addScript(src, key)
		{
		    var script = document.createElement("script");
		    script.type = "text/javascript";
		    script.src =  src+key;
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
			changeState('mapLoaded', true);
		}

		if ((typeof google == 'undefined') || (typeof google.maps == 'undefined')){
			addScript("https://maps.googleapis.com/maps/api/js?key=", Getwid.settings.google_api_key);
		} else {
			this.setState({
				mapLoaded: true,
				firstInit: true
			});
		}
		
	}

	setGoogleAPIKey(event) {
		event.preventDefault();

		var data = {
			'action': 'getwid_api_key',
			'data': this.getState('checkApiKey'),
			'option': 'set',
		};

		Getwid.settings.google_api_key = this.getState('checkApiKey');
		this.addGoogleAPIScript();
		jQuery.post(Getwid.ajax_url, data, function(response) {});
	}

	enterGoogleAPIKeyForm() {
		return (
			<form onSubmit={ event => this.setGoogleAPIKey(event)}>
				<TextControl
					label={__('Google API Key', 'getwid')}
					onChange={ value => this.changeState('checkApiKey', value) }
				/>
				<Button isPrimary type="submit">
					{__('Add Key', 'getwid')}
				</Button>
			</form>
		);
	}

	mapStyles (){
		const {
			attributes: {
				mapStyle,
				customStyle
			},
			className,
			setAttributes
		} = this.props;

		const { google_map_styles : stylesArr } = Getwid.settings;

		if (typeof mapStyle != 'object'){
			if (JSON.parse(mapStyle).value == 'custom'){
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
				return stylesArr[JSON.parse(mapStyle).value];
			}
		} else {
			return null;
		}
	}

	//Map
	initMap (refresh = false, prevProps) {
		const {
			attributes: {
				mapCenter,
				mapZoom,
				interaction,
				zoomControl,
				mapTypeControl,
				streetViewControl,
				fullscreenControl,
				markersArrays,
			},
			className,
			setAttributes
		} = this.props;

		const mapCenterChange = !isEqual(this.props.attributes.mapCenter, prevProps.attributes.mapCenter)

		const initMapEvents = this.initMapEvents;		
		const initMarkers = this.initMarkers;
		const onDeleteMarker = this.onDeleteMarker;		
		const changeState = this.changeState;
		const getState = this.getState;
		const mapStyles = this.mapStyles;

		let googleMap;

		if (this.getState('firstInit') == true ){
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

			var current_marker;

			googleMap = new google.maps.Map(mapSelector, {
				center: mapCenter,
				styles: mapStyles(),
				gestureHandling: interaction,
				zoomControl: zoomControl,
				mapTypeControl: mapTypeControl,
				streetViewControl: streetViewControl,
				fullscreenControl: fullscreenControl,
				zoom: mapZoom
			});

			
			this.setState({
				mapObj : googleMap,
				firstInit : false
			});

			if (markersArrays.length){
				$.each(markersArrays, function(index, val) {
					initMarkers(true, false, index, googleMap);
				});
			}

			googleMap.panTo(mapCenter);

			//Events
			initMapEvents(googleMap);
		} else {
			googleMap = this.getState('mapObj');
			googleMap.setOptions({
				styles: mapStyles(),
				gestureHandling: interaction,
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

	initMapEvents(googleMap){
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
				markersArrays
			},
			setAttributes
		} = this.props;

		const getState = this.getState;
		const changeState = this.changeState;

		const newItems = markersArrays.filter((item, idx) => idx !== getState('currentMarker'));

		changeState('currentMarker', null);

		setAttributes( {
			markersArrays: newItems,
		} );
	}

	//Markers
	initMarkers(firstInit = false, refreshMarker = false, markerID = 0, googleMap = false) {
		const {
			attributes: {
				markersArrays
			},
			className
		} = this.props;

		const {
			markerArrTemp
		} = this.state;

		const latLng = markersArrays[markerID].coords;

		let marker;

		if (refreshMarker == false) {
			marker = new google.maps.Marker({
				uuID : markersArrays[markerID].uuID,
				position: latLng,
				map: googleMap,
				draggable: true,
				animation: google.maps.Animation.DROP,
			});

			markerArrTemp.push(marker);

			if (markersArrays[markerID].bounce){			
				setTimeout(function(){marker.setAnimation(google.maps.Animation.BOUNCE); }, 2000);
			}

		} else {
			marker = markerArrTemp[markerID];
			marker.setPosition( latLng );
		}

		if (!firstInit){
			googleMap.panTo(latLng);
		}

		var message = `<div class='${className}__marker-title'>
			<h2>${markersArrays[markerID].title}</h2>
			<div class='${className}__marker-description'>${markersArrays[markerID].description}</div>
		</div>`;

		this.attachMessage(marker, message, markersArrays[markerID].popUpOpen, refreshMarker);
	}

	//Pop-up messages
	attachMessage(marker, message, opened, refreshMarker) {
		const {
			className,
			setAttributes
		} = this.props;

		const getState = this.getState;
		const changeState = this.changeState;
		const key_in_array = this.key_in_array;
		const updateArrValues = this.updateArrValues;

		let popUp;

		if (refreshMarker == false) {
			popUp = new google.maps.InfoWindow({
				content: message,
			});

			marker.popUp = popUp;
		} else {
			popUp = marker.popUp;
			popUp.setContent(message);
		}		

		if (refreshMarker){
			popUp.close();
		}

		if (opened){
			popUp.open(marker.get('map'), marker);
		}

		google.maps.event.clearInstanceListeners(marker);
		marker.addListener('click', function() {
			popUp.open(marker.get('map'), marker);
			changeState('currentMarker', key_in_array(getState('markerArrTemp'), marker.uuID));

		});

		marker.addListener('rightclick', function() {

			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
				updateArrValues( {
					bounce: false
				}, key_in_array(getState('markerArrTemp'), marker.uuID) );

			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				updateArrValues( {
					bounce: true
				}, key_in_array(getState('markerArrTemp'), marker.uuID) );

			}

		});

		marker.addListener('dragend', function(event) {

			updateArrValues( {
				coords: {
					lat: event.latLng.lat(),
					lng: event.latLng.lng()
				}
			}, key_in_array(getState('markerArrTemp'), marker.uuID) );

		});

	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	componentDidMount() {
		if (this.getState('googleApiKey') != ''){
			this.addGoogleAPIScript();
		}
	}

	componentDidUpdate(prevProps) {
		const {
			attributes: {
				markersArrays: prevItems,
			}
		} = prevProps;

		if (Getwid.settings.google_api_key != ''){
			// if (!isEqual(this.props.attributes, prevProps.attributes) || !!prevItems.length) {
			this.initMap(!!prevItems.length, prevProps );
		}
	}

	onAddMarker() {
		const {
			attributes: {
				markersArrays
			},
			setAttributes,
		} = this.props;

		const newSlides = markersArrays;
		const changeState = this.changeState;

		newSlides.push(
			{
				uuID: this.create_markers_UUID(),
				title: '',
				description: '',
				popUpOpen: false,
				bounce: false,
				coords: {
					lat: 0,
					lng: 0,
				},
			}
		);

		setAttributes( {
			markersArrays: newSlides,
		} );

		changeState('currentMarker', (newSlides.length == 1) ? 0 : (newSlides.length -1));
	}

	onDeleteMarker(markerID = 0) {
		const {
			attributes:{
				markersArrays
			},
			setAttributes
		} = this.props;

		const {
			markerArrTemp
		} = this.state;

		const getState = this.getState;
		const changeState = this.changeState;

		const newItems = markersArrays.filter((item, idx) => idx !== markerID);
		const newmarkerArrTemp = markerArrTemp.filter((item, idx) => idx !== markerID);

		const marker = markerArrTemp[markerID];

		marker.setMap(null);

		changeState('currentMarker', null);
		changeState('markerArrTemp', newmarkerArrTemp);
		setAttributes( {
			markersArrays: newItems,
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
				markersArrays,
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

		const wrapperClass = classnames( className,
			{
				[`${className}--dropMarker`] : (getState('action') == 'drop')
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
					<Toolbar controls={[
						{
							icon: 'location',
							title: __('Drop a marker', 'getwid'),
							isActive: (getState('action') == 'drop'),
							onClick: () => {
								this.onAddMarker();
								changeState('action', 'drop');
							}
						},
						{
							icon: 'edit',
							title: __('Edit a marker', 'getwid'),
							isDisabled: (getState('currentMarker') === null || getState('action') == 'drop'),
							isActive: (getState('action') == 'edit' && getState('editModal') == true),
							onClick: () => {
								changeState('action', 'edit');
								changeState('editModal', true);
							},
						},
						{
							icon: 'trash',
							title: __('Delete a marker', 'getwid'),
							isDisabled: (getState('currentMarker') === null || getState('action') == 'drop'),
							onClick: () => {
								this.onDeleteMarker(getState('currentMarker'));
							}
						},
					]}/>

				</BlockControls>
				<Inspector {...{ ...this.props, ...{initMarkers}, ...{cancelMarker}, ...{onDeleteMarker}, ...{updateArrValues}, ...{changeState}, ...{getState} }} key='inspector'/>

				<div className={wrapperClass}>
					<div style={{height: mapHeight + 'px'}} className={`${className}__container`}></div>
				</div>

			</Fragment>
		);
	}
}
export default ( Edit );