import GetwidStyleLengthControl from 'GetwidControls/style-length-control';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component} = wp.element;

const {
	InspectorControls,
	ColorPalette,
	FontSizePicker,
	PanelColorSettings
} = wp.editor;

const {
	IconButton,
	PanelBody,
	RangeControl,
	ToggleControl,
	Toolbar,
	SelectControl,
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {

		const {
			attributes: {
				id,
				url,
				type,
				title,
				text,
				link,
				align,
				minHeight,
				verticalAlign,
				horizontalAlign,
				textColor,
				overlayColor,
				backgroundOpacity,
				blockAnimation,
				textAnimation,
			},
			setAttributes
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__('Alignment', 'getwid')} initialOpen={true}>
					<GetwidStyleLengthControl
						label={__('Min Height', 'getwid')}
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
						label={__('Vertical Alignment', 'getwid')}
						value={verticalAlign !== undefined ? verticalAlign : 'center'}
						onChange={verticalAlign => setAttributes({verticalAlign})}
						options={[
							{value: 'top', label: __('Top', 'getwid')},
							{value: 'center', label: __('Middle', 'getwid')},
							{value: 'bottom', label: __('Bottom', 'getwid')},
						]}
					/>
					<SelectControl
						label={__('Horizontal Alignment', 'getwid')}
						value={horizontalAlign !== undefined ? horizontalAlign : 'center'}
						onChange={horizontalAlign => setAttributes({horizontalAlign})}
						options={[
							{value: 'left', label: __('Left', 'getwid')},
							{value: 'center', label: __('Center', 'getwid')},
							{value: 'right', label: __('Right', 'getwid')},
						]}
					/>
				</PanelBody>

				<PanelColorSettings
					title={ __( 'Colors', 'getwid' ) }
					initialOpen={ false }
					colorSettings={ [
						{
							value: textColor,
							onChange: textColor => setAttributes({textColor}),
							label: __( 'Text Color', 'getwid' ),
						},
						{
							value: overlayColor,
							onChange: overlayColor => setAttributes({overlayColor}),
							label: __( 'Overlay Color', 'getwid' ),
						}
					] }
				>
					<RangeControl
						label={ __( 'Background Opacity', 'getwid' ) }
						value={ backgroundOpacity }
						onChange={backgroundOpacity => setAttributes({backgroundOpacity})}
						min={ 0 }
						max={ 100 }
						step={ 5 }
					/>
				</PanelColorSettings>

				<PanelBody title={__('Animation', 'getwid')} initialOpen={false}>
					<SelectControl
						label={__('Block animation', 'getwid')}
						value={blockAnimation}
						onChange={blockAnimation => setAttributes({blockAnimation})}
						options={[
							{value: 'style1', label: __('Aries', 'getwid')},
							{value: 'style2', label: __('Taurus', 'getwid')},
							{value: 'style3', label: __('Gemini', 'getwid')},
							{value: 'style4', label: __('Cancer', 'getwid')},
							{value: 'style5', label: __('Leo', 'getwid')},
							{value: 'style6', label: __('Virgo', 'getwid')},
						]}
					/>

					<SelectControl
						label={__('Text animation', 'getwid')}
						value={textAnimation}
						onChange={textAnimation => setAttributes({textAnimation})}
						options={[
							{value: 'none', label: __('None', 'getwid')},
							{value: 'text-opacity', label: __('Fade In', 'getwid')},
							{value: 'text-opacity-top', label: __('Fade In Up', 'getwid')},
							{value: 'text-opacity-bottom', label: __('Fade In Down', 'getwid')},
							{value: 'text-opacity-left', label: __('Fade In Left', 'getwid')},
							{value: 'text-opacity-right', label: __('Fade In Right', 'getwid')},
							{value: 'text-opacity-zoom-in', label: __('Zoom In', 'getwid')},
							{value: 'text-opacity-zoom-out', label: __('Zoom Out', 'getwid')},
						]}
					/>
				</PanelBody>				
			</InspectorControls>
		);
	}
}