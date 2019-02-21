/**
 * Inspector Controls
 */

import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import GetwidSelect2Control from 'GetwidControls/select2-react';

import {
	pick,
	times
} from "lodash";

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
	RadioControl,
	TextControl,
	CheckboxControl
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
				content,
				backgroundColor,
				textColor,
				customBackgroundColor,
				customTextColor,
				titleTag,
				fontFamily,
				fontSize,
				fontWeight,
				fontStyle,
				textTransform,
				lineHeight,
				letterSpacing,
				align,
				textAlignment,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				textAnimation,
				textAnimationDuration,
				textAnimationDelay,
			},
			changeState,
			getState,
			setAttributes,
			className,
		} = this.props;

		const hastextAnimation = () => {
			return textAnimation !== 'fadeIn' ||
				textAnimationDelay !== '0ms' ||
				textAnimationDuration !== '1500ms';
		};
		const resettextAnimation = () => {
			setAttributes({
				textAnimation: 'fadeIn',
				textAnimationDelay: '0ms',
				textAnimationDuration: '1500ms'
			})
		};

		const renderAnimationSettings = () => {		
			return (
				<Fragment>
					{
						hastextAnimation() &&
						<Fragment>
							<Button isLink isDestructive onClick={resettextAnimation}>
								{__('Reset', 'getwid')}
							</Button>
						</Fragment>
					}
					<GetwidAnimationSelectControl
						label={__('Animation Effect', 'getwid')}
						allowAnimation={['Entrance','Seeker']}
						value={textAnimation !== 'fadeIn' ? textAnimation : 'fadeIn'}
						onChange={textAnimation => setAttributes({textAnimation})}
					/>
					<SelectControl
						label={__('Duration', 'getwid')}
						value={textAnimationDuration !== undefined ? textAnimationDuration : ''}
						onChange={textAnimationDuration => setAttributes({textAnimationDuration})}
						options={[
							{value: '3000ms', label: __('Very Slow', 'getwid')},
							{value: '2000ms', label: __('Slow', 'getwid')},
							{value: '1500ms', label: __('Normal', 'getwid')},
							{value: '800ms', label: __('Fast', 'getwid')},
							{value: '400ms', label: __('Very Fast', 'getwid')},
						]}
					/>
					<TextControl
						label={__('Delay, ms', 'getwid')}
						value={textAnimationDelay !== undefined ? textAnimationDelay.replace('ms', '') : ''}
						type={'number'}
						min={0}
						onChange={textAnimationDelay => {
							textAnimationDelay = parseInt(textAnimationDelay);
							if (isNaN(textAnimationDelay)) {
								textAnimationDelay = undefined;
							} else {
								textAnimationDelay = `${textAnimationDelay}ms`;
							}
							setAttributes({textAnimationDelay})
						}}
					/>
				</Fragment>
			);
		};

		//*********/RENDER PARTS*********

		const hasPadding = () => {
			return paddingTop !== undefined ||
				paddingBottom !== undefined ||
				paddingRight !== undefined ||
				paddingLeft !== undefined;
		}

		const resetPadding = () => {
			setAttributes({
				paddingTop: undefined,
				paddingBottom: undefined,
				paddingLeft: undefined,
				paddingRight: undefined
			})
		};

		const selectStyles = {
			menuList: (base) => ({
				...base,
				height: 200,
			}),
		};

		return (
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={true}>
					<SelectControl
						label={__('Title Tag', 'getwid')}
						value={titleTag}
						options={[
							{value: 'span', label: __('Paragraph', 'getwid')},
							{value: 'h2', label: __('Heading 2', 'getwid')},
							{value: 'h3', label: __('Heading 3', 'getwid')},
							{value: 'h4', label: __('Heading 4', 'getwid')},
							{value: 'h5', label: __('Heading 5', 'getwid')},
							{value: 'h6', label: __('Heading 6', 'getwid')},
						]}
						onChange={titleTag => setAttributes({titleTag})}
					/>				
					<GetwidSelect2Control
						className={`${className}__select2`}
						styles={selectStyles}
						label={ __( 'Font Family', 'getwid' ) }
						value={ fontFamily != '' ? JSON.parse( fontFamily ) : '' }
						options={[
							{value: 'default', label: __('Just Icon', 'getwid')},
							{value: 'stacked', label: __('With Background', 'getwid')},
							{value: 'framed', label: __('With Frame Border', 'getwid')},
						]}
						isMulti={false}
						menuPlacement={'bottom'}
						onChange={ value => {
							setAttributes({fontFamily: JSON.stringify(value)});
						} }
					/>
					<GetwidStyleLengthControl
						label={__('Font Size', 'getwid')}
						value={fontSize}
						onChange={fontSize => {
							setAttributes({fontSize});
						}}
					/>
					<SelectControl
						label={__('Font Weight', 'getwid')}
						value={fontWeight}
						options={[
							{value: '100', label: __('100', 'getwid')},
							{value: '200', label: __('200', 'getwid')},
							{value: '300', label: __('300', 'getwid')},
							{value: '400', label: __('400', 'getwid')},
							{value: '500', label: __('500', 'getwid')},
							{value: '600', label: __('600', 'getwid')},
							{value: '700', label: __('700', 'getwid')},
							{value: '800', label: __('800', 'getwid')},
							{value: '900', label: __('900', 'getwid')},
							{value: 'inherit', label: __('Inherit', 'getwid')},

						]}
						onChange={fontWeight => setAttributes({fontWeight})}
					/>
					<SelectControl
						label={__('Font Style', 'getwid')}
						value={fontStyle}
						options={[
							{value: 'normal', label: __('Normal', 'getwid')},
							{value: 'italic', label: __('Italic', 'getwid')},
							{value: 'oblique', label: __('Oblique', 'getwid')},
							{value: 'inherit', label: __('Inherit', 'getwid')},
						]}
						onChange={fontStyle => setAttributes({fontStyle})}
					/>
					<SelectControl
						label={__('Text Transform', 'getwid')}
						value={textTransform}
						options={[
							{value: 'none', label: __('None', 'getwid')},
							{value: 'capitalize', label: __('Capitalize', 'getwid')},
							{value: 'lowercase', label: __('Lowercase', 'getwid')},
							{value: 'uppercase', label: __('Uppercase', 'getwid')},
							{value: 'inherit', label: __('Inherit', 'getwid')},
						]}
						onChange={textTransform => setAttributes({textTransform})}
					/>
					<GetwidStyleLengthControl
						label={__('Line Height', 'getwid')}
						value={lineHeight}					
						onChange={lineHeight => {
							setAttributes({lineHeight});
						}}
					/>
					<GetwidStyleLengthControl
						label={__('Letter Spacing', 'getwid')}
						value={letterSpacing}
						units = {[
						   {label: 'px', value: 'px'},
						   {label: 'em', value: 'em'},
						   {label: 'pt', value: 'pt'},
						   {label: 'vh', value: 'vh'},
						   {label: 'vw', value: 'vw'},
						]}					
						onChange={letterSpacing => {
							setAttributes({letterSpacing});
						}}
					/>
				</PanelBody>
				
				<PanelColorSettings
					title={__('Colors', 'getwid')}
					colorSettings={[
						{
							value: textColor,
							onChange: textColor => setAttributes({textColor}),
							label: __('Text Color', 'getwid')
						},
						{
							value: backgroundColor,
							onChange: backgroundColor => setAttributes({backgroundColor}),
							label: __('Background Color', 'getwid')
						}						
					]}
				/>
				<PanelBody title={__('Padding', 'getwid')} initialOpen={false}>
					{
						hasPadding() &&
						<Button isLink isDestructive onClick={resetPadding} >
							{__('Reset', 'getwid')}
						</Button>
					}
					<GetwidStyleLengthControl
						label={__('Top', 'getwid')}
						value={paddingTop}
						onChange={paddingTop => {
							setAttributes({paddingTop});
						}}
					/>
					<GetwidStyleLengthControl
						label={__('Bottom', 'getwid')}
						value={paddingBottom}
						onChange={paddingBottom => {
							setAttributes({paddingBottom});
						}}
					/>
					<GetwidStyleLengthControl
						label={__('Left', 'getwid')}
						value={paddingLeft}
						onChange={paddingLeft => {
							setAttributes({paddingLeft});
						}}
					/>
					<GetwidStyleLengthControl
						label={__('Right', 'getwid')}
						value={paddingRight}
						onChange={paddingRight => {
							setAttributes({paddingRight});
						}}
					/>
				</PanelBody>

				<PanelBody title={__('Text Animation', 'getwid')} initialOpen={false}>
					{ renderAnimationSettings() }
				</PanelBody>			
			</InspectorControls>
		);
	}

}

export default ( Inspector );