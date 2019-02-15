/**
 * Inspector Controls
 */
import { times, escape, unescape} from 'lodash';
import FocusPanelBody from 'GetwidControls/focus-panel-body';

const { __ } = wp.i18n;
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
	MediaUpload,
	MediaPlaceholder,
	PanelColorSettings
} = wp.editor;
const {
	Button,
	BaseControl,
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
	Modal,
	TextControl,
	TextareaControl,
	ExternalLink,
	RadioControl
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );
	}

	render() {
		const {
			attributes: {
				mapHeight,
				mapCenter,
				mapZoom,
				mapStyle,
				interaction,
				zoomControl,
				mapTypeControl,
				streetViewControl,
				fullscreenControl,
				customStyle,
				mapMarkers,
				blockAlignment
			},
			//Functions
			initMarkers,
			cancelMarker,
			onDeleteMarker,
			updateArrValues,
			changeState,
			getState,
			manageGoogleAPIKey,
			removeGoogleAPIScript,
			
			setAttributes,
			className
		} = this.props;

		const mapMarkersParsed = (mapMarkers != '' ? JSON.parse(mapMarkers) : []);

		//*********RENDER PARTS*********
		const renderEditModal = ( index ) => {
			if (typeof mapMarkersParsed[ index ] !== 'undefined') {
				return (
					<Fragment>
						{ ( (getState('action') == 'edit' || getState('action') == 'drop') && getState('editModal') == true) ?
						<Modal
							className={`${className}__modal`}
							title= {__( 'Edit Marker', 'getwid' )}
							onRequestClose={ () => {
								changeState('action', false);
								changeState('editModal', false);

								if (getState('action') == 'drop'){
									cancelMarker();									
								} else {
									changeState('currentMarker', null);
								}
							} }
						>
							<Fragment>
								<TextControl
									label={__('Name', 'getwid')}
									value={ mapMarkersParsed[ index ].name }
									onChange={ value => {
										updateArrValues( { name: value }, index );
									} }
								/>
								<TextareaControl
									label={__('Popup Content. Plain Text or HTML.', 'getwid')}
									rows={'5'}
									value={ unescape(mapMarkersParsed[ index ].description) }
									onChange={ value => {
										updateArrValues( { description: escape(value) }, index );
									} }
								/>

								<ToggleControl
									label={ __( 'Opened by default', 'getwid' ) }
									checked={mapMarkersParsed[ index ].popUpOpen }
									onChange={ value => {
										updateArrValues( { popUpOpen: value }, index );
									} }
								/>

								<TextControl
									label={__('Popup Maximum Width, px', 'getwid')}
									value={ mapMarkersParsed[ index ].popUpMaxWidth }
									type={'number'}
									onChange={ value => {
										updateArrValues( { popUpMaxWidth: value }, index );
									}}
								/>

								<TextControl
									label={__('Latitude', 'getwid')}
									value={ mapMarkersParsed[ index ].coords.lat }
									type={'number'}
									onChange={ value => {
										updateArrValues( {
											coords: {
												lat: parseFloat(value),
												lng: mapMarkersParsed[ index ].coords.lng
											}
										}, index );
									}}
								/>

								<TextControl
									label={__('Longitude', 'getwid')}
									value={ mapMarkersParsed[ index ].coords.lng }
									type={'number'}
									onChange={ value => {
										updateArrValues( {
											coords: {
												lat: mapMarkersParsed[ index ].coords.lat,
												lng: parseFloat(value)
											}
										}, index );
									}}
								/>

								<ButtonGroup>
									<Button isPrimary onClick={ 
										() => {
											if (getState('action') == 'drop'){
												initMarkers(false, false, getState('currentMarker'), getState('mapObj'));												
											} else if (getState('action') == 'edit') {
												initMarkers(false, true, getState('currentMarker'), getState('mapObj'));
											}
											changeState('currentMarker', null);
											changeState('action', false);
											changeState('editModal', false);
										}
									}>
										{ getState('action') == 'drop' ? __( 'Save', 'getwid' ) : __( 'Update', 'getwid' ) }
									</Button>

									{ getState('action') == 'drop' && (
										<Button isDefault onClick={
											() => {
												changeState('action', false);
												changeState('editModal', false);

												cancelMarker();
											}
										}>
											{ __( 'Cancel', 'getwid' ) }
										</Button>
									)}
								</ButtonGroup>


							</Fragment>
						</Modal>
						: null }
					</Fragment>
				);
			}

		};

		const renderMarkersSettings = ( index ) => {

			if (typeof mapMarkersParsed[ index ] !== 'undefined') {

				return (
					<FocusPanelBody
						title={ __( 'Marker', 'getwid' ) + ': ' + mapMarkersParsed[ index ].name }
						initialOpen={ false }
						onOpen={ () => {
							getState('markerArrTemp')[index].setAnimation(google.maps.Animation.BOUNCE);
						}}
						onClose={ () => {
							getState('markerArrTemp')[index].setAnimation(null);
						}}
					>

						<TextControl
							label={__('Name', 'getwid')}
							value={ mapMarkersParsed[ index ].name }
							onChange={ value => {
								updateArrValues( { name: value }, index );
							} }
						/>
						<TextareaControl
							label={__('Popup Content. Plain Text or HTML.', 'getwid')}
							rows={'5'}
							value={ unescape(mapMarkersParsed[ index ].description) }
							onChange={ value => {
								updateArrValues( { description: escape(value) }, index );
							} }
						/>

						<ToggleControl
							label={ __( 'Opened by default', 'getwid' ) }
							checked={mapMarkersParsed[ index ].popUpOpen }
							onChange={ value => {
								updateArrValues( { popUpOpen: value }, index );
							} }
						/>

						<TextControl
							label={__('Popup Maximum Width, px', 'getwid')}
							value={ mapMarkersParsed[ index ].popUpMaxWidth }
							type={'number'}
							onChange={ value => {
								updateArrValues( { popUpMaxWidth: value }, index );
							}}
						/>

						<TextControl
							label={__('Latitude', 'getwid')}
							value={ mapMarkersParsed[ index ].coords.lat }
							type={'number'}
							onChange={ value => {
								updateArrValues( {
									coords: {
										lat: parseFloat(value),
										lng: mapMarkersParsed[ index ].coords.lng
									}
								}, index );
							}}
						/>

						<TextControl
							label={__('Longitude', 'getwid')}
							value={ mapMarkersParsed[ index ].coords.lng }
							type={'number'}
							onChange={ value => {
								updateArrValues( {
									coords: {
										lat: mapMarkersParsed[ index ].coords.lat,
										lng: parseFloat(value)
									}
								}, index );
							}}
						/>

						<ButtonGroup>
							<Button isPrimary onClick={ 
								() => {
									initMarkers(false, true, index, getState('mapObj'));
								}
							}>
								{ __( 'Update', 'getwid' ) }
							</Button>

							<Button isDefault onClick={
								() => {
									onDeleteMarker(index);
								}
							}>
								{ __( 'Remove', 'getwid' ) }
							</Button>
						</ButtonGroup>

					</FocusPanelBody>
				);

			}
		};

		//*********/RENDER PARTS*********
		return (
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={true}>

					<RangeControl
						label={__('Map Height', 'getwid')}
						value={mapHeight}
						onChange={mapHeight => {
							if (typeof mapHeight == 'undefined'){
								mapHeight = 600;
							}
							setAttributes({mapHeight});
						}}
						allowReset
						min={100}
						max={1080}
						step={1}
					/>

					<RadioControl
					    label={__('Zoom & Pan Interaction', 'getwid')}
					    help={__('Сhanges will be applied only on the frontend', 'getwid')}
					    selected={ interaction }
					    options={ [
							{value: 'cooperative', label: __('Prevent zoom on page scroll', 'getwid')},
							{value: 'none', label: __('Disable zoom and pan', 'getwid')},
							{value: 'greedy', label: __('Enable zoom and pan', 'getwid')},
					    ] }
					    onChange={interaction => setAttributes({interaction}) }
					/>

					<ToggleControl
						label={ __( 'Show Zoom', 'getwid' ) }
						checked={ zoomControl }
						onChange={ zoomControl => {
							setAttributes({zoomControl});
						} }
					/>
					<ToggleControl
						label={ __( 'Show Map Type', 'getwid' ) }
						checked={ mapTypeControl }
						onChange={ mapTypeControl => {
							setAttributes({mapTypeControl});
						} }
					/>
					<ToggleControl
						label={ __( 'Show Street View', 'getwid' ) }
						checked={ streetViewControl }
						onChange={ streetViewControl => {
							setAttributes({streetViewControl});
						} }
					/>
					<ToggleControl
						label={ __( 'Show Full Screen', 'getwid' ) }
						checked={ fullscreenControl }
						onChange={ fullscreenControl => {
							setAttributes({fullscreenControl});
						} }
					/>						

				</PanelBody>

				<PanelBody title={ __( 'Map Center & Zoom', 'getwid' ) } initialOpen={false}>

					<TextControl
						label={__('Zoom', 'getwid')}
						help={__('Drag and zoom map in preview area to apply.', 'getwid')}
						value={ mapZoom }
						type={'number'}
						min={1}
						max={22}
						step={1}					
						onChange={ value => {
							const googleMap = getState('mapObj');
							googleMap.setZoom((value == '' || value == 0) ? 1 : parseInt(value, 10));
						}}
					/>

					<TextControl
						label={__('Center Latitude', 'getwid')}
						value={ mapCenter.lat }
						type={'number'}
						onChange={ value => {
							setAttributes({
								mapCenter : {
									lat: parseFloat(value),
									lng: mapCenter.lng
								}
							});
						}}
					/>

					<TextControl
						label={__('Center Longitude', 'getwid')}
						value={ mapCenter.lng }
						type={'number'}
						onChange={ value => {
							setAttributes({
								mapCenter : {
									lat: mapCenter.lat,
									lng: parseFloat(value)
								}
							});
						}}
					/>
				</PanelBody>

				{ renderEditModal(getState('currentMarker')) }

				{ mapMarkersParsed.length > 0 && (
					<PanelBody title={ __( 'Markers', 'getwid' ) }>

						{ times( mapMarkersParsed.length, n => renderMarkersSettings( n ) ) }
						
					</PanelBody>
				)}

				<PanelBody title={ __( 'Style', 'getwid' ) } initialOpen={false}>
			    	
					<SelectControl
						label={__('Map Style', 'getwid')}
						value={mapStyle}
						onChange={mapStyle => setAttributes({mapStyle})}
						options={[
							{value: 'default', label: __('Default', 'getwid'), },
							{value: 'silver', label: __('Silver', 'getwid'), },
							{value: 'retro', label: __('Retro', 'getwid'), },
							{value: 'dark', label: __('Dark', 'getwid'), },
							{value: 'night', label: __('Night', 'getwid'), },
							{value: 'aubergine', label: __('Aubergine', 'getwid'), },
							{value: 'blue_water', label: __('Blue water', 'getwid'), },
							{value: 'ultra_light', label: __('Ultra light', 'getwid'), },
							{value: 'dark_silver', label: __('Dark silver', 'getwid'), },
							{value: 'shades_of_grey', label: __('Shades of grey', 'getwid'), },
							{value: 'no_labels', label: __('No labels', 'getwid'), },
							{value: 'wild_west', label: __('Wild west', 'getwid'), },
							{value: 'vintage', label: __('Vintage', 'getwid'), },
							{value: 'wireframe', label: __('Wireframe', 'getwid'), },
							{value: 'light_dream', label: __('Light dream', 'getwid'), },
							{value: 'custom', label: __('Custom', 'getwid'), },
						]}
					/>

					{(typeof mapStyle != 'object' && mapStyle == 'custom') && (
						<Fragment>
							<TextareaControl
								label={__('Custom Style (JSON)', 'getwid')}
								rows={'8'}
								value={ customStyle }
								onChange={ value => {
									setAttributes({customStyle: value});
								} }
							/>

							<ExternalLink href="https://mapstyle.withgoogle.com/">{__('Google Maps Styling Wizard', 'getwid')}</ExternalLink>
							<br/>
							<ExternalLink href="https://snazzymaps.com/explore">{__('Snazzy Maps', 'getwid')}</ExternalLink>

						</Fragment>
					)}
				</PanelBody>

				<PanelBody title={ __( 'Google Maps API Key', 'getwid' ) } initialOpen={false}>

						<TextControl
							label={__('Google Maps API Key', 'getwid')}
							value={ getState('checkApiKey') }
							onChange={ value => changeState('checkApiKey', value) }
						/>

						<ButtonGroup>
							<Button
							isPrimary
							disabled={((getState('checkApiKey') != '') ? null : true)}
							onClick={ 
								(event) => {
									removeGoogleAPIScript();
									manageGoogleAPIKey(event, 'set');
								}
							}>
								{ __( 'Update', 'getwid' ) }
							</Button>

							<Button isDefault onClick={
								(event) => {
									changeState('checkApiKey', '');
									changeState('googleApiKey', '');
									manageGoogleAPIKey(event, 'delete');
									removeGoogleAPIScript();
								}
							}>
								{ __( 'Remove', 'getwid' ) }
							</Button>
						</ButtonGroup>


				</PanelBody>

			</InspectorControls>
		);
	}

}

export default ( Inspector );