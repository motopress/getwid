/**
* External dependencies
*/
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import {renderPaddingsPanelWithTabs} from 'GetwidUtils/render-inspector';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
	PanelColorSettings,
} = wp.blockEditor || wp.editor;
const {
	SelectControl,
	PanelBody,
	RangeControl,
	Button,
	TabPanel,
} = wp.components;


/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	renderForegroundSettings(){
		// Setup the attributes
		const {
			attributes: {
				foregroundOpacity,
				foregroundColor,
				foregroundFilter,
				foregroundGradientType,
				foregroundGradientFirstColor,
				foregroundGradientFirstColorLocation,
				foregroundGradientSecondColor,
				foregroundGradientSecondColorLocation,
				foregroundGradientAngle,
			}, setAttributes
		} = this.props;

		const resetForegroundGradient = () => {
			setAttributes({
				foregroundGradientType: undefined,
				foregroundGradientFirstColor: undefined,
				foregroundGradientFirstColorLocation: undefined,
				foregroundGradientSecondColor: undefined,
				foregroundGradientSecondColorLocation: undefined,
				foregroundGradientAngle: undefined,
				foregroundGradientCustomEnable: undefined,
				foregroundGradientCustom: undefined,
			})
		};

		return (
			<PanelBody title={__('Overlay', 'getwid')} initialOpen={false}>
				<RangeControl
					label={__('Overlay Layer Opacity', 'getwid')}
					value={foregroundOpacity !== undefined ? foregroundOpacity : ''}
					onChange={foregroundOpacity => setAttributes({foregroundOpacity})}
					min={0}
					max={100}
					step={5}
					allowReset
				/>
				<SelectControl
					label={__('Blend Mode', 'getwid')}
					value={foregroundFilter !== undefined ? foregroundFilter : ''}
					onChange={foregroundFilter => setAttributes({foregroundFilter})}
					options={[
						{value: '', label: __('None', 'getwid')},
						{value: 'normal', label: __('Normal', 'getwid')},
						{value: 'multiply', label: __('Multiply', 'getwid')},
						{value: 'screen', label: __('Screen', 'getwid')},
						{value: 'overlay', label: __('Overlay', 'getwid')},
						{value: 'darken', label: __('Darken', 'getwid')},
						{value: 'lighten', label: __('Lighten', 'getwid')},
						{value: 'color-dodge', label: __('Color Dodge', 'getwid')},
						{value: 'color-burn', label: __('Color Burn', 'getwid')},
						{value: 'hard-light', label: __('Hard Light', 'getwid')},
						{value: 'soft-light', label: __('Soft Light', 'getwid')},
						{value: 'difference', label: __('Difference', 'getwid')},
						{value: 'exclusion', label: __('Exclusion', 'getwid')},
						{value: 'hue', label: __('Hue', 'getwid')},
						{value: 'saturation', label: __('Saturation', 'getwid')},
						{value: 'color', label: __('Color', 'getwid')},
						{value: 'luminosity', label: __('Luminosity', 'getwid')},
					]}
				/>
				<PanelColorSettings
					title={__('Overlay Color', 'getwid')}
					colorSettings={[
						{
							value: foregroundColor,
							onChange: foregroundColor => setAttributes({foregroundColor}),
							label: __('Overlay Color', 'getwid')
						}
					]}
					initialOpen={false}
				/>
				<PanelBody title={__('Overlay Gradient', 'getwid')} initialOpen={false}>
					<SelectControl
						value={foregroundGradientType !== undefined ? foregroundGradientType : ''}
						onChange={foregroundGradientType => setAttributes({foregroundGradientType})}
						options={[
							{value: '', label: __('None', 'getwid')},
							{value: 'linear', label: __('Linear', 'getwid')},
							{value: 'radial', label: __('Radial', 'getwid')},
						]}
					/>
					{ foregroundGradientType &&
					<Fragment>
						<Button isSmall onClick={resetForegroundGradient}>
							{__('Reset', 'getwid')}
						</Button>
						<PanelColorSettings
							title={__('Gradient Colors', 'getwid')}
							colorSettings={[
								{
									value: foregroundGradientFirstColor,
									onChange: foregroundGradientFirstColor => setAttributes({foregroundGradientFirstColor}),
									label: __('First Color', 'getwid')
								},
								{
									value: foregroundGradientSecondColor,
									onChange: foregroundGradientSecondColor => setAttributes({foregroundGradientSecondColor}),
									label: __('Second Color', 'getwid')
								}
							]}
						/>
						<RangeControl
							label={__('First Color Location', 'getwid')}
							value={foregroundGradientFirstColorLocation !== undefined ? foregroundGradientFirstColorLocation : ''}
							onChange={foregroundGradientFirstColorLocation => setAttributes({foregroundGradientFirstColorLocation})}
							placeholder={0}
							min={0}
							max={100}
							step={1}
						/>
						<RangeControl
							label={__('Second Color Location', 'getwid')}
							value={foregroundGradientSecondColorLocation !== undefined ? foregroundGradientSecondColorLocation : ''}
							onChange={foregroundGradientSecondColorLocation => setAttributes({foregroundGradientSecondColorLocation})}
							placeholder={100}
							min={0}
							max={100}
							step={1}
						/>
						{foregroundGradientType === 'linear' && (
							<RangeControl
								label={__('Angle', 'getwid')}
								value={foregroundGradientAngle !== undefined ? foregroundGradientAngle : ''}
								onChange={foregroundGradientAngle => setAttributes({foregroundGradientAngle})}
								placeholder={180}
								min={0}
								max={360}
								step={1}
							/>
						)}
					</Fragment>
					}
				</PanelBody>
			</PanelBody>
		);
	}

	renderAlignmentSettings() {
		// Setup the attributes
		const {
			verticalAlign, horizontalAlign,
			verticalAlignTablet, horizontalAlignTablet,
			verticalAlignMobile, horizontalAlignMobile,
		} = this.props.attributes;
		const { setAttributes } = this.props;

		return (
			<PanelBody title={__('Alignment', 'getwid')} initialOpen={false}>
				<TabPanel className="getwid-editor-tabs"
						  activeClass="is-active"
						  tabs={ [
							  {
								  name: 'desktop',
								  title: __('Desktop', 'getwid'),
								  className: 'components-button is-link is-small',
							  },
							  {
								  name: 'tablet',
								  title: __('Tablet', 'getwid'),
								  className: 'components-button is-link is-small',
							  },
							  {
								  name: 'mobile',
								  title: __('Mobile', 'getwid'),
								  className: 'components-button is-link is-small',
							  },
						  ] }>
					{
						(tab) => {
							switch (tab.name){
								case 'desktop':{
									return(
										<Fragment>
											<SelectControl
												label={__('Vertical Alignment', 'getwid')}
												value={verticalAlign !== undefined ? verticalAlign : 'center'}
												onChange={verticalAlign => setAttributes({verticalAlign})}
												options={[
													{value: 'flex-start', label: __('Top', 'getwid')},
													{value: 'center', label: __('Middle', 'getwid')},
													{value: 'flex-end', label: __('Bottom', 'getwid')},
												]}
											/>
											<SelectControl
												label={__('Horizontal Alignment', 'getwid')}
												value={horizontalAlign !== undefined ? horizontalAlign : 'center'}
												onChange={horizontalAlign => setAttributes({horizontalAlign})}
												options={[
													{value: 'flex-start', label: __('Left', 'getwid')},
													{value: 'center', label: __('Center', 'getwid')},
													{value: 'flex-end', label: __('Right', 'getwid')},
												]}
											/>
										</Fragment>
									)
								}
								case 'tablet':{
									return(
										<Fragment>
											<SelectControl
												label={__('Vertical Alignment', 'getwid')}
												value={verticalAlignTablet !== undefined ? verticalAlignTablet : 'center'}
												onChange={verticalAlignTablet => setAttributes({verticalAlignTablet})}
												options={[
													{value: '', label: __('Default', 'getwid')},
													{value: 'flex-start', label: __('Top', 'getwid')},
													{value: 'center', label: __('Middle', 'getwid')},
													{value: 'flex-end', label: __('Bottom', 'getwid')},
												]}
											/>
											<SelectControl
												label={__('Horizontal Alignment', 'getwid')}
												value={horizontalAlignTablet !== undefined ? horizontalAlignTablet : 'center'}
												onChange={horizontalAlignTablet => setAttributes({horizontalAlignTablet})}
												options={[
													{value: '', label: __('Default', 'getwid')},
													{value: 'flex-start', label: __('Left', 'getwid')},
													{value: 'center', label: __('Center', 'getwid')},
													{value: 'flex-end', label: __('Right', 'getwid')},
												]}
											/>
										</Fragment>
									)
								}
								case 'mobile':{
									return(
										<Fragment>
											<SelectControl
												label={__('Vertical Alignment', 'getwid')}
												value={verticalAlignMobile !== undefined ? verticalAlignMobile : 'center'}
												onChange={verticalAlignMobile => setAttributes({verticalAlignMobile})}
												options={[
													{value: '', label: __('Default', 'getwid')},
													{value: 'flex-start', label: __('Top', 'getwid')},
													{value: 'center', label: __('Middle', 'getwid')},
													{value: 'flex-end', label: __('Bottom', 'getwid')},
												]}
											/>
											<SelectControl
												label={__('Horizontal Alignment', 'getwid')}
												value={horizontalAlignMobile !== undefined ? horizontalAlignMobile : 'center'}
												onChange={horizontalAlignMobile => setAttributes({horizontalAlignMobile})}
												options={[
													{value: '', label: __('Default', 'getwid')},
													{value: 'flex-start', label: __('Left', 'getwid')},
													{value: 'center', label: __('Center', 'getwid')},
													{value: 'flex-end', label: __('Right', 'getwid')},
												]}
											/>
										</Fragment>
									)
								}
							}
						}

					}
				</TabPanel>
			</PanelBody>
		);
	}

	render() {
		const {
			attributes: {
				//Content
				minHeight,
				contentMaxWidth,
				imageSize
			},
			setAttributes,
			changeState,
			getState,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __('Settings', 'getwid') }>
					<GetwidStyleLengthControl
						label={__('Image Height', 'getwid')}
						value={minHeight}
						units={[
							{label: 'px', value: 'px'},
							{label: 'vh', value: 'vh'},
							{label: 'vw', value: 'vw'},
							{label: '%', value: '%'}
						]}
						onChange={minHeight => setAttributes({minHeight})}
					/>

					<RangeControl
						label={__('Content Width', 'getwid')}
						value={contentMaxWidth !== undefined ? contentMaxWidth : ''}
						onChange={contentMaxWidth => {
							setAttributes({contentMaxWidth});
						}}
						allowReset
						min={0}
						max={2000}
						step={1}
					/>		

					<SelectControl
						label={__('Image Size', 'getwid')}
						help={__('For images from Media Library only.', 'getwid')}
						value={imageSize}
						onChange={ (value) => {
							setAttributes( { imageSize: value } );
						}}
						options={Getwid.settings.image_sizes}
					/>							
				</PanelBody>

				{this.renderAlignmentSettings()}

				{renderPaddingsPanelWithTabs(this)}

				{this.renderForegroundSettings()}
								
			</InspectorControls>
		);
	}
}