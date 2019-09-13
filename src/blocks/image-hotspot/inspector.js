/**
* External dependencies
*/
import GetwidIconPicker from 'GetwidControls/icon-picker';
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import { times, escape, unescape} from 'lodash';
import FocusPanelBody from 'GetwidControls/focus-panel-body';


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
	Dashicon,
	Popover,
	IconButton,
	TabPanel,
} = wp.components;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-image-hotspot';


/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				id,
				imageSize,
				imagePoints,

				tooltipTrigger,
				tooltipTheme,
				tooltipArrow,
				tooltipAnimation,
				dotIcon,
				dotSize,
				dotPaddings,
				dotColor,
				dotBackground,
				dotOpacity,
				dotPulse,
				dotAppearanceAnimation,
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
			getState,
			thisBlock
		} = this.props;

		const imageDots = $(`.${baseClass}__image-wrapper .${baseClass}__dot` , thisBlock );

		const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

		const renderDeleteModal = ( index ) => {
			if (typeof imagePointsParsed[ index ] !== 'undefined') {
				return (
					<Fragment>
						{ (getState('deleteModal') == true) ?
						<Modal
							className={`${className}__modal-delete`}
							title= {__( 'Delete', 'getwid' )}
							shouldCloseOnClickOutside={false}
							shouldCloseOnEsc={false}
							onRequestClose={ () => {
								changeState({
									deleteModal: false,
									currentPoint: null,
								});
							} }
						>
							<Fragment>
								<ButtonGroup>
									<Button isPrimary onClick={
										() => {
											onDeletePoint(index);
										}
									}>
										{ __( 'Delete', 'getwid' ) }
									</Button>

									<Button isDefault onClick={
										() => {
											changeState({
												deleteModal: false,
												currentPoint: null,
											});
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

		const renderEditModal = ( index ) => {
			if (typeof imagePointsParsed[ index ] !== 'undefined') {
				return (
					<Fragment>
						{ ( (getState('action') == 'edit' || getState('action') == 'drop') && getState('editModal') == true) ?
						<Modal
							className={`${className}__modal`}
							title= {__( 'Edit Point', 'getwid' )}
							shouldCloseOnClickOutside={false}
							shouldCloseOnEsc={false}
							onRequestClose={ () => {
								changeState({
									action: false,
									editModal: false,
								});

								if (getState('action') == 'drop'){
									onCancelPoint();
								} else {
									changeState('currentPoint', null);
								}
							} }
						>
							<Fragment>

								{ renderPointsFields(index, true) }

								<ButtonGroup>
									<Button isPrimary onClick={
										() => {
											changeState({
												updatePoints: true,
												currentPoint: null,
												action: false,
												editModal: false,
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

		const contentFields = (index, popup) => (
			<Fragment>
				<TextControl
					label={__('Title', 'getwid')}
					value={ imagePointsParsed[ index ].title }
					onChange={ value => {
						updateArrValues( { title: value }, index );
					} }
				/>

				<Fragment>
					<div className = {`components-base-control ${baseClass}__url-field`}>
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
			</Fragment>
		);


		const placementFields = (index, popup) => (
			<Fragment>
				<RangeControl
					label={__('X Coord (%)', 'getwid')}
					value={parseFloat(imagePointsParsed[ index ].position.x) }
					onChange={ value => {
						if (typeof value == 'undefined'){
							value = 50;
						}

						updateArrValues( {
							position: {
								x: parseFloat(value) + '%',
								y: imagePointsParsed[ index ].position.y
							}
						}, index );
					} }
					allowReset
					min={0}
					max={100}
					step={0.5}
				/>

				<RangeControl
					label={__('Y Coord (%)', 'getwid')}
					value={parseFloat(imagePointsParsed[ index ].position.y) }
					onChange={ value => {
						if (typeof value == 'undefined'){
							value = 50;
						}

						updateArrValues( {
							position: {
								x: imagePointsParsed[ index ].position.x,
								y: parseFloat(value) + '%'
							}
						}, index );
					} }
					allowReset
					min={0}
					max={100}
					step={0.5}
				/>

				{ popup ? (
					<SelectControl
						label={__('Tooltip Position', 'getwid')}
						selected={ imagePointsParsed[ index ].placement }
						options={ [
							{value: 'top', label: __('Top', 'getwid')},
							{value: 'right', label: __('Right', 'getwid')},
							{value: 'bottom', label: __('Bottom', 'getwid')},
							{value: 'left', label: __('Left', 'getwid')},
						] }
						onChange={ value => {
							updateArrValues( { placement: value }, index );
							changeState({
								updatePoints: true,
								highlightDot: true,
							});
						} }
					/>
				) : (
					<RadioControl
						label={__('Tooltip Position', 'getwid')}
						selected={ imagePointsParsed[ index ].placement }
						options={ [
							{value: 'top', label: __('Top', 'getwid')},
							{value: 'right', label: __('Right', 'getwid')},
							{value: 'bottom', label: __('Bottom', 'getwid')},
							{value: 'left', label: __('Left', 'getwid')},
						] }
						onChange={ value => {
							updateArrValues( { placement: value }, index );
							changeState({
								updatePoints: true,
								highlightDot: true,
							});
						} }
					/>
				)}

				<TextControl
					label={__('Popup Maximum Width, px.', 'getwid')}
					value={ imagePointsParsed[ index ].popUpWidth }
					type={'number'}
					onChange={ value => {
						updateArrValues( { popUpWidth: value }, index );
					}}
				/>
			</Fragment>
		);

		const styleFields = (index, popup) => (
			<Fragment>
				<BaseControl
					label={__('Point Icon', 'getwid')}
				>

					<GetwidIconPicker
						value={ imagePointsParsed[ index ].icon }
						onChange={ value => {
							updateArrValues( { icon: value }, index );
							changeState({
								updatePoints: true,
								highlightDot: true,
							});
						}}
					/>
				</BaseControl>

				<PanelColorSettings
					title={__('Colors', 'getwid')}
					colorSettings={[
						{
							value: imagePointsParsed[ index ].backgroundColor,
							onChange: (value) => {
								updateArrValues( { backgroundColor: value }, index );
								changeState({
									updatePoints: true,
									highlightDot: true,
								});
							},
							label: __('Point Background', 'getwid')
						},
						{
							value: imagePointsParsed[ index ].color,
							onChange: (value) => {
								updateArrValues( { color: value }, index );
								changeState({
									updatePoints: true,
									highlightDot: true,
								});
							},
							label: __('Icon Color', 'getwid')
						},
					]}
				>
				</PanelColorSettings>
			</Fragment>
		);

		const renderDotTabs = ( self, tab, index, popup = false ) => {
			switch ( tab.name ) {
				case 'content': {
					return (
						<Fragment>
							{contentFields(index, popup)}
						</Fragment>
					);
				}
				case 'placement': {
					return(
						<Fragment>
							{placementFields(index, popup)}
						</Fragment>
					);
				}
				case 'style': {
					return(
						<Fragment>
							{styleFields(index, popup)}
						</Fragment>
					);
				}
			}
		};

		const renderPointsFields = ( index, popup = false ) => {

			return(
				<Fragment>
					{ popup ? (
						<TabPanel className='getwid-modal-editor-tabs'
							activeClass='is-active'
							tabs={ [
								{
									name: 'content',
									title: __( 'Content', 'getwid' ),
									className: 'components-button',
								},
								{
									name: 'placement',
									title: __( 'Position', 'getwid' ),
									className: 'components-button',
								},
								{
									name: 'style',
									title: __( 'Style', 'getwid' ),
									className: 'components-button',
								}
							] }>
						{ tab => renderDotTabs( self, tab, index, popup ) }
					</TabPanel>
					) : (
						<Fragment>
							<PanelBody title={ __( 'Content', 'getwid' ) } initialOpen={true}>
								{contentFields(index, popup)}
							</PanelBody>

							<PanelBody title={ __( 'Position', 'getwid' ) } initialOpen={true}>
								{placementFields(index, popup)}
							</PanelBody>

							<PanelBody title={ __( 'Style', 'getwid' ) } initialOpen={true}>
								{styleFields(index, popup)}
							</PanelBody>
						</Fragment>
					)}
				</Fragment>
			);

		};

		const renderPointsSettings = ( index ) => {

			if (typeof imagePointsParsed[ index ] !== 'undefined') {

				return (
					<FocusPanelBody
						title={ __( 'Point', 'getwid' ) + ': ' + (imagePointsParsed[ index ].title.length > 20 ? imagePointsParsed[ index ].title.substr(0, 20) + '...' : imagePointsParsed[ index ].title) }
						initialOpen={ false }
						onOpen={ () => {
							changeState({
								currentPoint: index,
							});
							const thisDots = $(`.${baseClass}__image-wrapper .${baseClass}__dot[data-point-id="${index}"]` , thisBlock );
							imageDots.removeClass('is-selected');
							thisDots.addClass('is-selected');
						}}
						onClose={ () => {
							changeState('currentPoint', null);
							imageDots.removeClass('is-selected');
						}}
					>

						{ renderPointsFields(index, false) }

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

					</FocusPanelBody>
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
					<RadioControl
						label={__('Tooltip Interactivity', 'getwid')}
						help={__('These options are applied on frontend only.', 'getwid')}
					    selected={ tooltipTrigger }
					    options={ [
							{value: 'hover', label: __('Hover', 'getwid')},
							{value: 'click', label: __('Click', 'getwid')},
							{value: 'multiple', label: __('Click (Multiple)', 'getwid')},
					    ] }
					    onChange={tooltipTrigger => setAttributes({tooltipTrigger}) }
					/>
					<SelectControl
						label={__('Tooltip Theme', 'getwid')}
						value={tooltipTheme}
						onChange={tooltipTheme => setAttributes({tooltipTheme})}
						options={[
							{value: 'light', label: __('Default', 'getwid'), },
							{value: 'dark', label: __('Dark', 'getwid'), },
							{value: 'light-border', label: __('Light with border', 'getwid'), },
							{value: 'google', label: __('Google', 'getwid'), },
							{value: 'translucent', label: __('Dark with transparency', 'getwid'), },
						]}
					/>
					<ToggleControl
						label={ __( 'Display tooltip arrow', 'getwid' ) }
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
						label={__('Point animation on hover', 'getwid')}
						help={__('These options are applied on frontend only.', 'getwid')}
						value={hoverAnimation !== undefined ? hoverAnimation : ''}
						onChange={hoverAnimation => setAttributes({hoverAnimation})}
						allowAnimation={['Seeker']}
					/>
					<BaseControl
						label={__('Point Icon', 'getwid')}
					>
						<GetwidIconPicker
							value={dotIcon}
							onChange={dotIcon => setAttributes({dotIcon})}
						/>
					</BaseControl>
					<RangeControl
						label={__('Point Size', 'getwid')}
						value={dotSize}
						onChange={dotSize => {
							if (typeof dotSize == 'undefined'){
								dotSize = 16;
							}
							setAttributes({dotSize});
						}}
						allowReset
						min={2}
						max={64}
						step={1}
					/>
					<RangeControl
						label={__('Point Spacing', 'getwid')}
						value={dotPaddings}
						onChange={dotPaddings => {
							if (typeof dotPaddings == 'undefined'){
								dotPaddings = 6;
							}
							setAttributes({dotPaddings});
						}}
						allowReset
						min={2}
						max={100}
						step={1}
					/>
					<PanelColorSettings
						title={__('Point Colors', 'getwid')}
						colorSettings={[
							{
								value: dotBackground,
								onChange: (val) => {
									setAttributes({dotBackground: val});
								},
								label: __('Point Background', 'getwid')
							},
							{
								value: dotColor,
								onChange: (val) => {
									setAttributes({dotColor: val});
								},
								label: __('Icon Color', 'getwid')
							},
						]}
					>
					</PanelColorSettings>
					<RangeControl
						label={__('Point Opacity', 'getwid')}
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

					<SelectControl
						label={__('Point Animation', 'getwid')}
						value={dotPulse}
						onChange={dotPulse => setAttributes({dotPulse})}
						options={[
							{value: 'none', label: __('None', 'getwid'), },
							{value: 'pulse', label: __('Pulse', 'getwid'), },
						]}
					/>

					<SelectControl
						label={__('Point Appearance Animation', 'getwid')}
						value={dotAppearanceAnimation}
						onChange={dotAppearanceAnimation => setAttributes({dotAppearanceAnimation})}
						options={[
							{value: 'none', label: __('None', 'getwid'), },
							{value: 'zoomIn', label: __('Zoom In', 'getwid'), },
							{value: 'slideDown', label: __('Slide Down', 'getwid'), },
						]}
					/>
				</PanelBody>

				{ renderDeleteModal(getState('currentPoint')) }

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
