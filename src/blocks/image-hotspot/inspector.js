/**
* External dependencies
*/
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import { times, escape, unescape} from 'lodash';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {Component, Fragment} = wp.element;
const {
	InspectorControls,
	PanelColorSettings,
	URLInput,
} = wp.editor;
const {
	PanelBody,
	BaseControl,
	RangeControl,
	SelectControl,
	TextareaControl,
	ToggleControl,
	TextControl,
	Button,
	Modal,
	ButtonGroup,
	RadioControl,
	Dashicon
} = wp.components;


/**
* Module Constants
*/
const NEW_TAB_REL = 'noreferrer noopener';
const baseClass = 'wp-block-getwid-image-hotspot';


/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	hasMargin() {
		const {attributes: {marginTop, marginBottom, marginLeft, marginRight}} = this.props;
		return marginTop !== undefined ||
			marginBottom !== undefined ||
			marginRight !== undefined ||
			marginLeft !== undefined;
	}

	render() {
		const {
			attributes: {
				id,
				imageSize,
				imagePoints,

				tooltipTrigger,
				tooltipTheme,
				tooltipPlacement,
				tooltipArrow,
				tooltipAnimation,
				dotSize,
				dotColor,
				dotBackground,
				dotOpacity,
				dotPulse,
				hoverAnimation,
			},
			setAttributes,
			className,
			imgObj,

			//Functions
			onCancelPoint,
			onDeletePoint,
			updateArrValues,
			changeImageSize,
			changeState,
			getState
		} = this.props;

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const renderEditModal = ( index ) => {
			if (typeof imagePointsParsed[ index ] !== 'undefined') {
				return (
					<Fragment>
						{ ( (getState('action') == 'edit' || getState('action') == 'drop') && getState('editModal') == true) ?
						<Modal
							className={`${className}__modal`}
							title= {__( 'Edit Point', 'getwid' )}
							shouldCloseOnClickOutside={false}
							onRequestClose={ () => {
								changeState({
									action: false,
									editModal: false
								});								

								if (getState('action') == 'drop'){
									onCancelPoint();		
								} else {
									changeState('currentPoint', null);
								}
							} }
						>
							<Fragment>
							
								{ renderPointsFields(index) }

								<ButtonGroup>
									<Button isPrimary onClick={ 
										() => {
											changeState({
												updatePoints: true,
												currentPoint: null,
												action: false,
												editModal: false
											});
										}
									}>
										{ getState('action') == 'drop' ? __( 'Save', 'getwid' ) : __( 'Update', 'getwid' ) }
									</Button>

									{ getState('action') == 'drop' && (
										<Button isDefault onClick={
											() => {
												changeState({
													action: false,
													editModal: false
												});

												onCancelPoint();
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

		const renderPointsFields = ( index ) => {

			return(
				<Fragment>
					<TextControl
						label={__('Title', 'getwid')}
						value={ imagePointsParsed[ index ].title }
						onChange={ value => {
							updateArrValues( { title: value }, index );
						} }
					/>

					<Fragment>
						<div className = {`${baseClass}__url-field`}>
							<Dashicon className={`${baseClass}__url-icon`} icon="admin-links"/>				
							<TextControl
								placeholder={ __( 'Enter URL', 'getwid' ) }
								value={ imagePointsParsed[ index ].link }
								onChange={ value => {
									updateArrValues( { link: value }, index );
								} }
							/>							
							<ToggleControl
								label={ __( 'Open in New Tab', 'getwid' ) }
								checked={imagePointsParsed[ index ].newTab }
								onChange={ value => {
									updateArrValues( { newTab: value }, index );
								} }
							/>
						</div>
					</Fragment>	

					<TextareaControl
						label={__('Popup Content. Plain Text or HTML.', 'getwid')}
						rows={'5'}
						value={ unescape(imagePointsParsed[ index ].content) }
						onChange={ value => {
							updateArrValues( { content: escape(value) }, index );
						} }
					/>

					<ToggleControl
						label={ __( 'Opened by default', 'getwid' ) }
						checked={imagePointsParsed[ index ].popUpOpen }
						onChange={ value => {
							updateArrValues( { popUpOpen: value }, index );
						} }
					/>

					<TextControl
						label={__('Popup Minimum Width, px.', 'getwid')}
						value={ imagePointsParsed[ index ].popUpMinWidth }
						type={'number'}
						onChange={ value => {
							updateArrValues( { popUpMinWidth: value }, index );
						}}
					/>

					<TextControl
						label={__('Popup Maximum Width, px.', 'getwid')}
						value={ imagePointsParsed[ index ].popUpMaxWidth }
						type={'number'}
						onChange={ value => {
							updateArrValues( { popUpMaxWidth: value }, index );
						}}
					/>
				</Fragment>
			);

		};

		const renderPointsSettings = ( index ) => {

			if (typeof imagePointsParsed[ index ] !== 'undefined') {

				return (
					<PanelBody
						title={ __( 'Point', 'getwid' ) + ': ' + imagePointsParsed[ index ].title }
						initialOpen={ false }
					>

						{ renderPointsFields(index) }

						<ButtonGroup>
							<Button isPrimary onClick={ 
								() => {
									changeState('updatePoints', true);
								}
							}>
								{ __( 'Update', 'getwid' ) }
							</Button>

							<Button isDefault onClick={
								() => {
									onDeletePoint(index);
								}
							}>
								{ __( 'Delete', 'getwid' ) }
							</Button>
						</ButtonGroup>

					</PanelBody>
				);

			}
		};		

		const onChangeImageSize = (imageSize) => {

			if (typeof imgObj != 'undefined'){
				setAttributes( {
					imageSize
				} );
				changeImageSize(imgObj, imageSize);
			}			
		};

		return (
			<InspectorControls>

				<PanelBody
					title={__('Settings', 'getwid')}
				>
					<SelectControl
						label={__('Image Size', 'getwid')}
						help={__('For images from Media Library only.', 'getwid')}
						value={imageSize}
						onChange={onChangeImageSize}
						options={Getwid.settings.image_sizes}
					/>
				</PanelBody>

				<PanelBody
					title={__('Tooltip', 'getwid')}
				>

					<RadioControl
						label={__('Show on', 'getwid')}
						help={__('These options are applied on frontend only.', 'getwid')}
					    selected={ tooltipTrigger }
					    options={ [
							{value: 'hover', label: __('Hover', 'getwid')},
							{value: 'click', label: __('Click (One)', 'getwid')},
							{value: 'multiple', label: __('Click (Multiple)', 'getwid')},
					    ] }
					    onChange={tooltipTrigger => setAttributes({tooltipTrigger}) }
					/>

					<SelectControl
						label={__('Theme', 'getwid')}
						value={tooltipTheme}
						onChange={tooltipTheme => setAttributes({tooltipTheme})}
						options={[
							{value: 'light', label: __('Light', 'getwid'), },
							{value: 'dark', label: __('Dark', 'getwid'), },
							{value: 'light-border', label: __('Light border', 'getwid'), },
							{value: 'google', label: __('Google', 'getwid'), },		
							{value: 'translucent', label: __('Dark Transparent', 'getwid'), },		
						]}
					/>

					<RadioControl
					    label={__('Placement', 'getwid')}
					    selected={ tooltipPlacement }
					    options={ [
							{value: 'top', label: __('Top', 'getwid')},
							{value: 'right', label: __('Right', 'getwid')},
							{value: 'bottom', label: __('Bottom', 'getwid')},
							{value: 'left', label: __('Left', 'getwid')},
					    ] }
					    onChange={tooltipPlacement => setAttributes({tooltipPlacement}) }
					/>

					<ToggleControl
						label={ __( 'Arrow', 'getwid' ) }
						checked={ tooltipArrow }
						onChange={ tooltipArrow => {
							setAttributes({tooltipArrow});
						} }
					/>

					<SelectControl
						label={__('Tooltip Animation', 'getwid')}
						value={tooltipAnimation}
						onChange={tooltipAnimation => setAttributes({tooltipAnimation})}
						options={[
							{value: 'shift-away', label: __('Shift-away', 'getwid'), },
							{value: 'shift-toward', label: __('Shift-toward', 'getwid'), },
							{value: 'fade', label: __('Fade', 'getwid'), },
							{value: 'scale', label: __('Scale', 'getwid'), },
							{value: 'perspective', label: __('Perspective', 'getwid'), },		
						]}
					/>

					<GetwidAnimationSelectControl
						label={__('Dot Hover Animation', 'getwid')}
						value={hoverAnimation !== undefined ? hoverAnimation : ''}
						onChange={hoverAnimation => setAttributes({hoverAnimation})}
						allowAnimation={['Seeker']}
					/>

					<RangeControl
						label={__('Dot size', 'getwid')}
						value={dotSize}
						onChange={dotSize => {
							if (typeof dotSize == 'undefined'){
								dotSize = 20;
							}
							setAttributes({dotSize});
						}}
						allowReset
						min={2}
						max={50}
						step={1}
					/>

					<PanelColorSettings
						title={__('Dot Colors', 'getwid')}
						colorSettings={[
							{
								value: dotColor,
								onChange: (val) => {
									setAttributes({dotColor: val});
								},
								label: __('Inner', 'getwid')
							},
							{
								value: dotBackground,
								onChange: (val) => {
									setAttributes({dotBackground: val});
								},
								label: __('Background', 'getwid')
							},
						]}
					>
					</PanelColorSettings>					

					<RangeControl
						label={__('Dot opacity', 'getwid')}
						value={dotOpacity}
						onChange={dotOpacity => {
							if (typeof dotOpacity == 'undefined'){
								dotOpacity = 100;
							}
							setAttributes({dotOpacity});
						}}
						allowReset
						min={0}
						max={100}
						step={1}
					/>

					<ToggleControl
						label={ __( 'Pulse', 'getwid' ) }
						checked={ dotPulse }
						onChange={ dotPulse => {
							setAttributes({dotPulse});
						} }
					/>

				</PanelBody>

				{ renderEditModal(getState('currentPoint')) }

				{ imagePointsParsed.length > 0 && (
					<PanelBody title={ __( 'Points', 'getwid' ) }>

						{ times( imagePointsParsed.length, n => renderPointsSettings( n ) ) }
						
					</PanelBody>
				)}

			</InspectorControls>
		);
	}
}

export default ( Inspector );