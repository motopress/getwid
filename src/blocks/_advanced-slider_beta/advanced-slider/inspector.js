/**
 * Inspector Controls
 */

import GetwidIconPicker from 'GetwidControls/icon-picker';
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control'
import {pick} from "lodash";
import times from 'lodash/times';

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
} = wp.components;

/*

import { ClipboardButton } from '@wordpress/components';
import { withState } from '@wordpress/compose';

import { withState } from '@wordpress/compose';*/

const ALLOWED_SLIDER_MEDIA_TYPES = [ 'image' ];
const ALLOWED_IMAGE_MEDIA_TYPES = ['image'];

/**
 * Create an Inspector Controls wrapper Component
 */
class Inspector extends Component {

	constructor( props ) {
		console.warn(props);
		super( ...arguments );

		const {
			attributes: {
				currentSlide,
				sliderArrays
			}
		} = this.props;

		// this.onDeleteTab = this.onDeleteTab.bind(this);

		// this.itemsManager = new ItemsAttributeManager(sliderArrays);

		this.state = {
			selectedSlide: currentSlide !== undefined ? currentSlide - 1 : (items.length ? 0 : null),
		};	
	}



	render() {

		const {
			attributes: {
				uniqueID,
				slideCount,
				blockAlignment,
				currentSlide,
				sliderArrays,
				slideAlignment,
				iSize
			},
			setAttributes,
			updateArrValues
		} = this.props;

		const {selectedSlide} = this.state;

		//*********RENDER PARTS*********
		const renderBackgroundImage = ( index ) => {
			if (typeof sliderArrays[ index ] !== 'undefined')		
			return (
				<PanelBody title={__('Background Image', 'getwid')} initialOpen={true}>
					<MediaUpload
						value={ sliderArrays[ index ].background.image.imageObj !== undefined ? sliderArrays[ index ].background.image.imageObj.id : ''}
						onSelect={ value => {
							updateArrValues( { background: { image: { imageObj: pick(value, ['alt', 'id', 'url']) } } }, index );
						} }
						allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
						render={ ( { open } ) => (
							<BaseControl>
								{ !!sliderArrays[ index ].background.image.imageObj &&
								<div className="background-img">
								    <img src={sliderArrays[ index ].background.image.imageObj.url}/>
								</div>
								}
								<Button
									isDefault
									onClick={ open }
								>
									{!sliderArrays[ index ].background.image.imageObj.url && __('Select Image', 'getwid')}
									{!!sliderArrays[ index ].background.image.imageObj.url && __('Replace Image', 'getwid')}
								</Button>
								{ !!sliderArrays[ index ].background.image.imageObj.url &&
									<Fragment>
										<br />
										<Button onClick={ () => {
											updateArrValues( { backgroundImage: { image: '' } }, index );
										}} isLink isDestructive>
											{ __( 'Remove', 'getwid' ) }
										</Button>
									</Fragment>
								}
							</BaseControl>
						) }
					/>

					{!!sliderArrays[ index ].background.image.imageObj.url &&
						<Fragment>
							<SelectControl
								label={__('Position', 'getwid')}
								value={ sliderArrays[ index ].background.image.imagePosition }
								onChange={ value => {
									updateArrValues( { background: { image: { imagePosition: value } } }, index );
								} }
								options={[
									{value: '', label: __('Center', 'getwid')},
									{value: 'top left', label: __('Top Left', 'getwid')},
									{value: 'top center', label: __('Top', 'getwid')},
									{value: 'top right', label: __('Top Right', 'getwid')},
									{value: 'center left', label: __('Left', 'getwid')},
									{value: 'center right', label: __('Right', 'getwid')},
									{value: 'bottom left', label: __('Bottom Left', 'getwid')},
									{value: 'bottom center', label: __('Bottom Center', 'getwid')},
									{value: 'bottom right', label: __('Bottom Right', 'getwid')},
								]}
							/>
							<SelectControl
								label={__('Attachment', 'getwid')}
								value={ sliderArrays[ index ].background.image.imageAttachment }
								onChange={ value => {
									updateArrValues( { background: { image: { imageAttachment: value } } }, index );
								} }
								options={[
									/*Inherit*/
									{value: '', label: __('-', 'getwid')},
									{value: 'scroll', label: __('Scroll', 'getwid')},
									{value: 'fixed', label: __('Fixed', 'getwid')},
								]}
							/>

							<SelectControl
								label={__('Repeat', 'getwid')}
								value={ sliderArrays[ index ].background.image.imageRepeat }
								onChange={ value => {
									updateArrValues( { background: { image: { imageRepeat: value } } }, index );
								} }
								options={[
									/*Inherit*/
									{value: '', label: __('-', 'getwid')},
									{value: 'no-repeat', label: __('No Repeat', 'getwid')},
									{value: 'repeat', label: __('Repeat', 'getwid')},
									{value: 'repeat-x', label: __('Repeat X', 'getwid')},
									{value: 'repeat-y', label: __('Repeat Y', 'getwid')},
									{value: 'space', label: __('Space', 'getwid')},
									{value: 'round', label: __('Round', 'getwid')},
								]}
							/>

							<SelectControl
								label={__('Size', 'getwid')}
								value={ sliderArrays[ index ].background.image.imageSize }
								onChange={ value => {
									updateArrValues( { background: { image: { imageSize: value } } }, index );
								} }
								options={[
									/*Auto*/
									{value: '', label: __('-', 'getwid')},
									{value: 'cover', label: __('Cover', 'getwid')},
									{value: 'contain', label: __('Contain', 'getwid')},
								]}
							/>
						</Fragment>
					}
				</PanelBody>
			);
		};

























































		const resetBackgroundGradient = (index) => {
			updateArrValues( 
				{

					background:{
						gradient: {
							gradientType: '',
							firstColor: '',
							firstColorLocation: 0,
							secondColor: '',
							secondColorLocation: 100,
							gradientAngle: 180
						},
					},

				},
				index
			);
		};



// value={ sliderArrays[ index ].backgroundGradient.gradientType }
// onChange={ value => {
// 	updateArrValues( { backgroundGradient: { gradientType: value } }, index );
// } }

		const renderBackgroundColors = ( index ) => {
			if (typeof sliderArrays[ index ] !== 'undefined')		
			return (
				<Fragment>
					<PanelColorSettings
						title={__('Background Color', 'getwid')}
						colorSettings={[
							{
								value: sliderArrays[ index ].background.color,
								onChange: value => {
									updateArrValues( { background: { color: value } }, index );
								},
								label: __('Background Color', 'getwid')
							}
						]}
						initialOpen={false}
					/>
					<PanelBody title={__('Gradient', 'getwid')} initialOpen={false}>
						<SelectControl
							value={ sliderArrays[ index ].background.gradient.gradientType }
							onChange={ value => {
								updateArrValues( { background: { gradient: { gradientType: value } } }, index );
							} }
							options={[
								{value: '', label: __('-', 'getwid')},
								{value: 'linear', label: __('Linear', 'getwid')},
								{value: 'radial', label: __('Radial', 'getwid')},
							]}
						/>
						{ sliderArrays[ index ].background.gradient.gradientType &&
							<Fragment>
								<Button isLink isDestructive onClick={() => {
									resetBackgroundGradient(index);
								}}>
									{__('Reset', 'getwid')}
								</Button>
								<PanelColorSettings
									title={__('Gradient Colors', 'getwid')}
									colorSettings={[
										{
											value: sliderArrays[ index ].background.gradient.firstColor,
											onChange: value => {
												updateArrValues( { background: { gradient: { firstColor: value } } }, index );
											},
											label: __('First Color', 'getwid')
										},
										{
											value: sliderArrays[ index ].background.gradient.secondColor,
											onChange: value => {
												updateArrValues( { background: { gradient: { secondColor: value } } }, index );
											},											
											label: __('Second Color', 'getwid')										
										}
									]}
								/>
								<RangeControl
									label={__('First Color Location', 'getwid')}
									value={ sliderArrays[ index ].background.gradient.firstColorLocation }
									onChange={ value => {
										updateArrValues( { background: { gradient: { firstColorLocation: value } } }, index );
									} }
									placeholder={0}
									min={0}
									max={100}
									step={1}
								/>
								<RangeControl
									label={__('Second Color Location', 'getwid')}
									value={ sliderArrays[ index ].background.gradient.secondColorLocation }
									onChange={ value => {
										updateArrValues( { background: { gradient: { secondColorLocation: value } } }, index );
									} }
									placeholder={100}
									min={0}
									max={100}
									step={1}
								/>

								{sliderArrays[ index ].background.gradient.gradientType === 'linear' &&
									<RangeControl
										label={__('Angle', 'getwid')}
										value={ sliderArrays[ index ].background.gradient.gradientAngle }
										onChange={ value => {
											updateArrValues( { background: { gradient: { gradientAngle: value } } }, index );
										} }
										placeholder={180}
										min={0}
										max={360}
										step={1}
									/>
								}
							</Fragment>
						}
					</PanelBody>
				</Fragment>
			);
		};


		




















		const renderIcoSettings = ( index ) => {
			if (typeof sliderArrays[ index ] !== 'undefined')		
			return (
				<Fragment>
					<GetwidIconPicker
						icons={ iconList }
						value={ sliderArrays[ index ].icon }
						onChange={ value => {
							updateArrValues( { icon: value }, index );
						} }
						theme="default"
						isMulti={ false }
					/>
					<SelectControl
						label={ __( 'Icon Location' ) }
						value={ sliderArrays[ index ].iconSide }
						options={ [
							{ value: 'right', label: __( 'Right' ) },
							{ value: 'left', label: __( 'Left' ) },
							{ value: 'top', label: __( 'Top' ) },
						] }
						onChange={ value => {
							updateArrValues( { iconSide: value }, index );
						} }
					/>
					<ToggleControl
						label={ __( 'Show Only Icon?' ) }
						checked={ sliderArrays[ index ].onlyIcon }
						onChange={ value => {
							updateArrValues( { onlyIcon: value }, index );
						} }
					/>
				</Fragment>
			);
		};






















		//*********/RENDER PARTS*********







		const deskControls = (
			<PanelBody>
				<p className="components-base-control__label">{ __( 'Desktop Layout' ) }</p>
			
			</PanelBody>
		);


		const tabletControls = (
			<PanelBody>
				<p className="components-base-control__label">{ __( 'Tablet Layout' ) }</p>
			
			</PanelBody>
		);



		const tabControls = (
			<TabPanel className="kt-inspect-tabs"
				activeClass="current-slide"
				tabs={ [
					{
						name: 'desk',
						title: <Dashicon icon="desktop" />,
						className: 'kt-desk-tab',
					},
					{
						name: 'tablet',
						title: <Dashicon icon="tablet" />,
						className: 'kt-tablet-tab',
					},
				] }>
				{
					( tab ) => {
						let tabout;
						if ( tab.name ) {
							if ( 'desk' === tab.name ) {
								tabout = deskControls;
							} else if ( 'tablet' === tab.name ) {
								tabout = tabletControls;
							}
						} else {
							if ( 'desk' === tab ) {
								tabout = deskControls;
							} else if ( 'tablet' === tab ) {
								tabout = tabletControls;
							}
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);




		const { iconList } = Getwid.settings;

		const renderIconsSettings = ( index ) => {
			return (
				<PanelBody
					title={ __( 'Tab' ) + ' ' + ( index + 1 ) + ' ' + __( 'Icon' ) }
					initialOpen={ false }
				>
					<GetwidIconPicker
						icons={ iconList }
						value={ sliderArrays[ index ].icon }
						onChange={ value => {
							updateArrValues( { icon: value }, index );
						} }
						theme="default"
						isMulti={ false }
					/>
					<SelectControl
						label={ __( 'Icon Location' ) }
						value={ sliderArrays[ index ].iconSide }
						options={ [
							{ value: 'right', label: __( 'Right' ) },
							{ value: 'left', label: __( 'Left' ) },
							{ value: 'top', label: __( 'Top' ) },
						] }
						onChange={ value => {
							updateArrValues( { iconSide: value }, index );
						} }
					/>
					<ToggleControl
						label={ __( 'Show Only Icon?' ) }
						checked={ sliderArrays[ index ].onlyIcon }
						onChange={ value => {
							updateArrValues( { onlyIcon: value }, index );
						} }
					/>
				</PanelBody>
			);
		};

		const addNewSlide = ( nextSlide ) => {
			const newSlides = sliderArrays;

			if ( newSlides.length < nextSlide ) {
				const amount = Math.abs( nextSlide - newSlides.length );
				{ times( amount, n => {
					const tabnumber = nextSlide - n;
					newSlides.push( {
						text: sprintf( __( 'Slide %d' ), tabnumber ),
						icon: '',
						iconSide: 'right',
						onlyIcon: false,
						background:{
							color: '',
							gradient: {
								gradientType: '',
								firstColor: '',
								firstColorLocation: 0,
								secondColor: '',
								secondColorLocation: 100,
								gradientAngle: 180
							},
							image: {
								imageObj: {},
								imagePosition: '',
								imageAttachment: '',
								imageRepeat: '',
								imageSize: ''
							},
						},

						foreground:{
							opacity: 0,
							color: '',
							gradient: {
								gradientType: '',
								firstColor: '',
								firstColorLocation: 0,
								secondColor: '',
								secondColorLocation: 100,
								gradientAngle: 180
							},
							image: {
								imageObj: {},
								imagePosition: '',
								imageAttachment: '',
								imageRepeat: '',
								imageSize: ''
							},
						},
					} );
				} ); }
				console.warn(newSlides);
				setAttributes( { sliderArrays: newSlides } );
			} else {
				setAttributes( { sliderArrays: newSlides.slice(0, nextSlide) } );
			}

			setAttributes({
				slideCount: nextSlide,
			});
		};


		return (
		<InspectorControls key="inspector">
			<PanelBody title={__('Global Settings', 'getwid')} initialOpen={true}>
				<RangeControl
					label={ __( 'Slides count', 'getwid' ) }
					value={ slideCount }
					onChange={ ( nextSlide ) => {
						addNewSlide(nextSlide);
					}}
					min={ 1 }
					max={ 12 }
				/>
			</PanelBody>

			<PanelBody title={__('Background', 'getwid')} initialOpen={true}>
				{ renderBackgroundImage(currentSlide -1) }
				{ renderBackgroundColors(currentSlide -1) }
			</PanelBody>







			{ renderIcoSettings(currentSlide -1) }






			{ tabControls }





			<PanelBody title={ __( 'Tab Title Settings' ) }>						
				<PanelBody
					title={ __( 'Icon Settings' ) }
					initialOpen={ false }
				>
					<RangeControl
						label={ __( 'Icon Size' ) }
						value={ ( iSize ? iSize : '' ) }
						onChange={ ( value ) => setAttributes( { iSize: value } ) }
						min={ 2 }
						max={ 120 }
						step={ 1 }
					/>
					{ times( slideCount, n => renderIconsSettings( n ) ) }
				</PanelBody>
			</PanelBody>
		</InspectorControls>
		);
	}

}

// export default withNotices(Inspector);
export default ( Inspector );