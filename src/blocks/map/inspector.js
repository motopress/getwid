/**
 * Inspector Controls
 */
import times from 'lodash/times';
import { components as GetwidSelect2Components } from 'GetwidVendor/react-select';
import GetwidSelect2Control from 'GetwidControls/select2-react';

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
				markersArrays,
				blockAlignment
			},
			setAttributes,
			initMarkers,
			cancelMarker,
			onDeleteMarker,
			updateArrValues,
			changeState,
			getState,
			className
		} = this.props;

		//*********RENDER PARTS*********
		const renderEditModal = ( index ) => {
			if (typeof markersArrays[ index ] !== 'undefined') {

				return (
					<Fragment>
						{ ( (getState('action') == 'edit' || getState('action') == 'drop') && getState('editModal') == true) ?
						<Modal
							className={`${className}__modal`}
							title= {__( 'Edit marker', 'getwid' )}
							onRequestClose={ () => {
								changeState('action', false);
								changeState('editModal', false);
								cancelMarker();								
							} }
						>
							<Fragment>
								<TextControl
									label={__('Title', 'getwid')}
									value={ markersArrays[ index ].title }
									onChange={ value => {
										updateArrValues( { title: value }, index );
									} }
								/>
								<TextareaControl
									label={__('Description', 'getwid')}
									rows={'5'}
									value={ markersArrays[ index ].description }
									onChange={ value => {
										updateArrValues( { description: value }, index );
									} }
								/>

								<ToggleControl
									label={ __( 'Open Pop-up by default', 'getwid' ) }
									checked={ markersArrays[ index ].popUpOpen }
									onChange={ value => {
										updateArrValues( { popUpOpen: value }, index );
									} }
								/>

								<ButtonGroup>

									<TextControl
										label={__('Latitude', 'getwid')}
										value={ markersArrays[ index ].coords.lat }
										type={'number'}
										onChange={ value => {
											updateArrValues( { coords: { lat: parseFloat(value) } }, index );
										}}
									/>

									<TextControl
										label={__('Longitude', 'getwid')}
										value={ markersArrays[ index ].coords.lng }
										type={'number'}
										onChange={ value => {
											updateArrValues( { coords: { lng: parseFloat(value) } }, index );
										}}
									/>

									<Button isPrimary onClick={ 
										() => {
											if (getState('action') == 'drop'){
												initMarkers(false, false, getState('currentMarker'), getState('mapObj'));												
											} else if (getState('action') == 'edit') {
												initMarkers(false, true, getState('currentMarker'), getState('mapObj'));
											}
											changeState('action', 'save');
											changeState('editModal', false);
										}
									}>
										{ __( 'Save', 'getwid' ) }
									</Button>

									<Button isDefault onClick={
										() => {
											changeState('action', false);
											changeState('editModal', false);
											cancelMarker();
										}
									}>
										{ __( 'Cancel', 'getwid' ) }
									</Button>
								</ButtonGroup>


							</Fragment>
						</Modal>
						: null }
					</Fragment>
				);
			}

		};

		const renderMarkersSettings = ( index ) => {

			if (typeof markersArrays[ index ] !== 'undefined') {

				return (
					<PanelBody
						title={ __( 'Marker', 'getwid' ) + ': ' + markersArrays[ index ].title }
						initialOpen={ false }
					>

						<TextControl
							label={__('Title', 'getwid')}
							value={ markersArrays[ index ].title }
							onChange={ value => {
								updateArrValues( { title: value }, index );
							} }
						/>
						<TextareaControl
							label={__('Description', 'getwid')}
							rows={'5'}
							value={ markersArrays[ index ].description }
							onChange={ value => {
								updateArrValues( { description: value }, index );
							} }
						/>

						<ToggleControl
							label={ __( 'Open Pop-up by default' ) }
							checked={ markersArrays[ index ].popUpOpen }
							onChange={ value => {
								updateArrValues( { popUpOpen: value }, index );
							} }
						/>

						<ButtonGroup>

							<TextControl
								label={__('Latitude', 'getwid')}
								value={ markersArrays[ index ].coords.lat }
								type={'number'}
								onChange={ value => {
									updateArrValues( { coords: { lat: parseFloat(value) } }, index );
								}}
							/>

							<TextControl
								label={__('Longitude', 'getwid')}
								value={ markersArrays[ index ].coords.lng }
								type={'number'}
								onChange={ value => {
									updateArrValues( { coords: { lng: parseFloat(value) } }, index );
								}}
							/>

							<Button isPrimary onClick={ 
								() => {
									initMarkers(false, true, index, getState('mapObj'));
								}
							}>
								{ __( 'Update', 'getwid' ) }
							</Button>

							<Button className={'is-button is-remove'} onClick={
								() => {
									onDeleteMarker(index);
								}
							}>
								{ __( 'Remove', 'getwid' ) }
							</Button>
						</ButtonGroup>

					</PanelBody>
				);

			}
		};

		//*********/RENDER PARTS*********

		const { Option:GetwidSelect2Option } = GetwidSelect2Components;
						
		const selectLabelRender = (props) => {
			return (
			    <GetwidSelect2Option {...props}>
			    <div>{props.data.label}</div>
			    	
			    </GetwidSelect2Option>
			)
		};

		const selectStyles = {
			menuList: (base) => ({
				...base,
				height: 200,
			}),
		};

		return (
			<InspectorControls key="inspector">
				<RangeControl
					label={__('Map height (px)', 'getwid')}
					value={mapHeight}
					onChange={mapHeight => {
						setAttributes({mapHeight});
					}}
					allowReset
					min={100}
					max={2000}
					step={1}
				/>

				<TextControl
					label={__('Latitude (Map center)', 'getwid')}
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
					label={__('Longitude (Map center)', 'getwid')}
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

				<TextControl
					label={__('Map Zoom', 'getwid')}
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

				{ renderEditModal(getState('currentMarker')) }

				{ markersArrays.length > 0 && (
					<PanelBody title={ __( 'Markers Settings', 'getwid' ) }>

						{ times( markersArrays.length, n => renderMarkersSettings( n ) ) }
						
					</PanelBody>
				)}

				<PanelBody title={ __( 'Map settings' ) } initialOpen={false}>

					<RadioControl
					    label={__('Zoom & pan interaction', 'getwid')}
					    selected={ interaction }
					    options={ [
							{value: 'cooperative', label: __('Preventing zoom on page scroll', 'getwid')},
							{value: 'none', label: __('Disabling zoom and pan', 'getwid')},
							{value: 'greedy', label: __('Enabling zoom and pan', 'getwid')},
					    ] }
					    onChange={interaction => setAttributes({interaction}) }
					/>

					<ToggleControl
						label={ __( 'Zoom (Control)', 'getwid' ) }
						checked={ zoomControl }
						onChange={ zoomControl => {
							setAttributes({zoomControl});
						} }
					/>
					<ToggleControl
						label={ __( 'Map type (Control)', 'getwid' ) }
						checked={ mapTypeControl }
						onChange={ mapTypeControl => {
							setAttributes({mapTypeControl});
						} }
					/>
					<ToggleControl
						label={ __( 'Street view (Control)', 'getwid' ) }
						checked={ streetViewControl }
						onChange={ streetViewControl => {
							setAttributes({streetViewControl});
						} }
					/>
					<ToggleControl
						label={ __( 'Full screen (Control)', 'getwid' ) }
						checked={ fullscreenControl }
						onChange={ fullscreenControl => {
							setAttributes({fullscreenControl});
						} }
					/>						

				</PanelBody>

				<PanelBody title={ __( 'Map style', 'getwid' ) } initialOpen={false}>
				    <BaseControl
				        label={ __( 'Styles', 'getwid' ) }
				    >
						<GetwidSelect2Control
							className={`${className}__select2`}
							styles={selectStyles}
							
							value={ mapStyle != '' ? JSON.parse(mapStyle) : '' }
							options={[
								{value: 'default', label: __('Default', 'getwid')},
								{value: 'silver', label: __('Silver', 'getwid')},
								{value: 'retro', label: __('Retro', 'getwid')},
								{value: 'dark', label: __('Dark', 'getwid')},
								{value: 'night', label: __('Night', 'getwid')},
								{value: 'aubergine', label: __('Aubergine', 'getwid')},
								{value: 'blue_water', label: __('Blue water', 'getwid')},
								{value: 'ultra_light', label: __('Ultra light', 'getwid')},
								{value: 'dark_silver', label: __('Dark silver', 'getwid')},
								{value: 'shades_of_grey', label: __('Shades of Grey', 'getwid')},
								{value: 'no_labels', label: __('No labels', 'getwid')},
								{value: 'wild_west', label: __('Wild West', 'getwid')},
								{value: 'vintage', label: __('Vintage', 'getwid')},
								{value: 'wireframe', label: __('Wireframe', 'getwid')},
								{value: 'light_dream', label: __('Light dream', 'getwid')},
								{value: 'custom', label: __('Custom', 'getwid')},
							]}
							isMulti={false}
							menuPlacement={'top'}
							components={{ Option: selectLabelRender }}
							onChange={ value => {
								setAttributes({mapStyle : JSON.stringify(value) });
							} }
						/>
				    </BaseControl>

					{(typeof mapStyle != 'object' && JSON.parse(mapStyle).value == 'custom') && (
						<Fragment>
							<ExternalLink href="https://mapstyle.withgoogle.com/">Google Maps Styling Wizard</ExternalLink>
							<ExternalLink href="https://snazzymaps.com/explore">Snazzy Maps Styling Wizard</ExternalLink>

							<TextareaControl
								label={__('Custom style (JSON)', 'getwid')}
								rows={'14'}
								value={ customStyle }
								onChange={ value => {
									setAttributes({customStyle: value});
								} }
							/>
						</Fragment>
					)}
				</PanelBody>

			</InspectorControls>
		);
	}

}

export default ( Inspector );