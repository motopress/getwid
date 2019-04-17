
const { Component } = wp.element;

const {
	InspectorControls,
	PanelColorSettings

} = wp.editor;

const {
	CheckboxControl,
	TextControl,
	PanelBody,
	SelectControl,

} = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				start,
				end,
				decimalPlaces,
				duration,

				useEasing,
				useGrouping,
				separator,
				decimal,
				easing,
				numerals
			},
			setAttributes,

			textColor,
			setTextColor
			
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={true}>
					<TextControl
						type={ 'number' }
						label={__('Start', 'getwid')}						
						value={ isNaN(start) ? 0 : parseFloat(start) }
						onChange={ start => {
							setAttributes({ start: start.toString() })
						}}
					/>
					<TextControl
						type={ 'number' }
						label={__('End', 'getwid')}						
						value={ isNaN(end) ? 150 : parseFloat(end) }
						onChange={ end => { 
							setAttributes({ end: end.toString() })
						}}
					/>
					<TextControl
						type={ 'number' }
						label={__('Decimal places', 'getwid')}						
						value={ isNaN(decimalPlaces) ? 0 : parseInt(decimalPlaces) }
						onChange={ decimalPlaces => {
							setAttributes({ decimalPlaces: decimalPlaces.toString() })
						}}
					/>
					<TextControl
						type={ 'number' }
						label={__('Duration', 'getwid')}						
						value={ isNaN(duration) ? 3 : parseInt(duration) }
						onChange={ duration => {
							setAttributes({ duration: duration.toString() })
						}}
					/>
					<CheckboxControl
						label={__('Easing', 'getwid')}
						checked={ useEasing === 'true' ? true : false }
						onChange={ value => {
							setAttributes({ useEasing: value ? 'true' : 'false' })
						}}
					/>
					<CheckboxControl
						label={__('Show number position', 'getwid')}
						checked={ useGrouping === 'true' ? true : false }
						onChange={ value => { 
							setAttributes({ useGrouping: value ? 'true' : 'false' })
						}}
					/>
					<TextControl
						label={__('Thousands separator', 'getwid')}
						value={ separator === undefined ? ',' : separator }
						onChange={ separator => {
							setAttributes({ separator })
						}}
					/>
					<TextControl
						label={__('Decimal', 'getwid')}
						value={ decimal === undefined ? '.' : decimal }
						onChange={ decimal => {
							setAttributes({ decimal })
						}}
					/>
				</PanelBody>

				<PanelColorSettings
					title={__('Colors', 'getwid')}
					colorSettings={[{
							value: textColor.color,
							onChange: setTextColor,
							label: __('Text Color', 'getwid')
						}]
					}
					initialOpen={true}
				/>

				<PanelBody title={ __( 'Animation', 'getwid' ) } initialOpen={false}>
					<SelectControl
						label={__('Easing', 'getwid')}
						value={ easing === undefined ? 'outExpo' : easing }
						onChange={easing => {
							setAttributes({ easing })
						}}
						options={[
							{ value: 'outExpo',    label: __('OutExpo',    'getwid') },
							{ value: 'outQuintic', label: __('OutQuintic', 'getwid') },
							{ value: 'outCubic',   label: __('OutCubic',   'getwid') }
						]}
					/>
					<SelectControl
						label={__('Numerals', 'getwid')}
						value={ numerals === undefined ? 'default' : numerals }
						onChange={numerals => {
							setAttributes({ numerals })
						}}
						options={[
							{ value: 'default', 	   label: __('Default', 	   'getwid') },
							{ value: 'eastern_arabic', label: __('Eastern Arabic', 'getwid') },
							{ value: 'farsi', 		   label: __('Farsi', 		   'getwid') }
						]}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}	
}

export default Inspector;