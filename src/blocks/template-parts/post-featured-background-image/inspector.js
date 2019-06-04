/**
* External dependencies
*/
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
} = wp.editor;
const {
	SelectControl,
	PanelBody,
	TabPanel,
	BaseControl,
	Button,
	RangeControl,
	ToggleControl,
} = wp.components;


/**
* Module Constants
*/
const MAX_POSTS_COLUMNS = 6;


/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	hasPadding() {
		const {attributes: {
			paddingTopValue, paddingRightValue, paddingBottomValue, paddingLeftValue,
			paddingTop, paddingRight, paddingBottom, paddingLeft,
			paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet,
			paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile,
		}} = this.props;
		return paddingTopValue !== undefined ||
			paddingBottomValue !== undefined ||
			paddingRightValue !== undefined ||
			paddingLeftValue !== undefined ||
			paddingTop !== '' ||
			paddingRight !== '' ||
			paddingBottom !== '' ||
			paddingLeft !== '' ||
			paddingTopTablet !== '' ||
			paddingRightTablet !== '' ||
			paddingBottomTablet !== '' ||
			paddingLeftTablet !== '' ||
			paddingTopMobile !== '' ||
			paddingRightMobile !== '' ||
			paddingBottomMobile !== '' ||
			paddingLeftMobile !== '';
	}

	renderResponsivePaddingsTabs( tab ){

		const{
			attributes:{
				paddingTopValue, paddingRightValue, paddingBottomValue, paddingLeftValue,
				paddingTop, paddingRight, paddingBottom, paddingLeft,
				paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet,
				paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile,
			},
			setAttributes
		} = this.props;


		switch (tab.name){
			case 'desktop': {
				return(
					<Fragment>
						<SelectControl
							label={__('Padding Top', 'getwid')}
							value={paddingTop !== undefined ? paddingTop : ''}
							onChange={paddingTop => setAttributes({paddingTop})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'custom', label: __('Custom', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						{
							paddingTop === 'custom' && (
								<GetwidStyleLengthControl
									// label={__('Custom Top', 'getwid')}
									value={paddingTopValue}
									onChange={paddingTopValue => {
										setAttributes({paddingTopValue});
									}}
								/>
							)
						}
						<SelectControl
							label={__('Padding Bottom', 'getwid')}
							value={paddingBottom !== undefined ? paddingBottom : ''}
							onChange={paddingBottom => setAttributes({paddingBottom})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'custom', label: __('Custom', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						{
							paddingBottom === 'custom' && (
								<GetwidStyleLengthControl
									// label={__('Custom Bottom', 'getwid')}
									value={paddingBottomValue}
									onChange={paddingBottomValue => {
										setAttributes({paddingBottomValue});
									}}
								/>
							)
						}
						<SelectControl
							label={__('Padding Left', 'getwid')}
							value={paddingLeft !== undefined ? paddingLeft : ''}
							onChange={paddingLeft => setAttributes({paddingLeft})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'custom', label: __('Custom', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						{
							paddingLeft === 'custom' && (
								<GetwidStyleLengthControl
									// label={__('Custom Left', 'getwid')}
									value={paddingLeftValue}
									onChange={paddingLeftValue => {
										setAttributes({paddingLeftValue});
									}}
								/>
							)
						}
						<SelectControl
							label={__('Padding Right', 'getwid')}
							value={paddingRight !== undefined ? paddingRight : ''}
							onChange={paddingRight => setAttributes({paddingRight})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'custom', label: __('Custom', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						{
							paddingRight === 'custom' && (
								<GetwidStyleLengthControl
									// label={__('Custom Right', 'getwid')}
									value={paddingRightValue}
									onChange={paddingRightValue => {
										setAttributes({paddingRightValue});
									}}
								/>
							)
						}
					</Fragment>
				)
			}
			case 'tablet': {
				return(
					<Fragment>
						<SelectControl
							label={__('Padding Top', 'getwid')}
							value={paddingTopTablet !== undefined ? paddingTopTablet : ''}
							onChange={paddingTopTablet => setAttributes({paddingTopTablet})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						<SelectControl
							label={__('Padding Bottom', 'getwid')}
							value={paddingBottomTablet !== undefined ? paddingBottomTablet : ''}
							onChange={paddingBottomTablet => setAttributes({paddingBottomTablet})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						<SelectControl
							label={__('Padding Left', 'getwid')}
							value={paddingLeftTablet !== undefined ? paddingLeftTablet : ''}
							onChange={paddingLeftTablet => setAttributes({paddingLeftTablet})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>

						<SelectControl
							label={__('Padding Right', 'getwid')}
							value={paddingRightTablet !== undefined ? paddingRightTablet : ''}
							onChange={paddingRightTablet => setAttributes({paddingRightTablet})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
					</Fragment>
				)
			}
			case 'mobile': {
				return(
					<Fragment>
						<SelectControl
							label={__('Padding Top', 'getwid')}
							value={paddingTopMobile !== undefined ? paddingTopMobile : ''}
							onChange={paddingTopMobile => setAttributes({paddingTopMobile})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						<SelectControl
							label={__('Padding Bottom', 'getwid')}
							value={paddingBottomMobile !== undefined ? paddingBottomMobile : ''}
							onChange={paddingBottomMobile => setAttributes({paddingBottomMobile})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						<SelectControl
							label={__('Padding Left', 'getwid')}
							value={paddingLeftMobile !== undefined ? paddingLeftMobile : ''}
							onChange={paddingLeftMobile => setAttributes({paddingLeftMobile})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>

						<SelectControl
							label={__('Padding Right', 'getwid')}
							value={paddingRightMobile !== undefined ? paddingRightMobile : ''}
							onChange={paddingRightMobile => setAttributes({paddingRightMobile})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
					</Fragment>
				)
			}

		}
	}

	render() {
		const {
			attributes: {
				//Content
				minHeight,
				imageSize
			},
			setAttributes,
			changeState,
			getState,
		} = this.props;
		
		const resetPadding = () => {
			setAttributes({
				paddingTopValue: undefined,
				paddingBottomValue: undefined,
				paddingLeftValue: undefined,
				paddingRightValue: undefined,

				paddingTop: '',
				paddingBottom: '',
				paddingLeft: '',
				paddingRight: '',

				paddingTopTablet: '',
				paddingBottomTablet: '',
				paddingLeftTablet: '',
				paddingRightTablet: '',

				paddingTopMobile: '',
				paddingBottomMobile: '',
				paddingLeftMobile: '',
				paddingRightMobile: '',
			})
		};

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

				<PanelBody title={__('Padding', 'getwid')} initialOpen={false}>

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
							(tab) => this.renderResponsivePaddingsTabs(tab)

						}
					</TabPanel>
					<BaseControl>
						<Button isLink
							onClick={resetPadding}
							disabled={ !this.hasPadding() }>
							{__('Reset All', 'getwid')}
						</Button>
					</BaseControl>
				</PanelBody>				
			</InspectorControls>
		);
	}
}