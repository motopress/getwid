
const {Component, Fragment} = wp.element;

const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;

const {
	CheckboxControl,
	TextControl,
	PanelBody,
	SelectControl,
	Button
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
				prefix,
				suffix,
				easing,
				numerals
			},
			setAttributes,

			textColor,
			setTextColor
			
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={false}>
					<TextControl
						label={__('Start', 'getwid')}
						type={ 'number' }
						value={ isNaN(start) ? 0 : parseInt(start) }
						onChange={ start => setAttributes({ start: start.toString() })}
					/>
					<TextControl
						label={__('End', 'getwid')}
						type={ 'number' }
						value={ isNaN(end) ? 150 : parseInt(end) }
						onChange={ end => { setAttributes({ end: end.toString() })}}
					/>
					<TextControl
						label={__('Decimal places', 'getwid')}
						type={ 'number' }
						value={ isNaN(decimalPlaces) ? 0 : parseInt(decimalPlaces) }
						onChange={ decimalPlaces => setAttributes({ decimalPlaces: decimalPlaces.toString() })}
					/>
					<TextControl
						label={__('Duration', 'getwid')}
						type={ 'number' }
						value={ isNaN(duration) ? 3 : parseInt(duration) }
						onChange={ duration => setAttributes({ duration: duration.toString() })}
					/>
					<CheckboxControl
						label='Easing'
						checked={ useEasing === undefined ? true : useEasing }
						onChange={ useEasing => {
							setAttributes({ useEasing: (useEasing ? true : false) })
						}}
					/>
					<CheckboxControl
						label='Grouping'
						checked={ useGrouping === undefined ? true : useGrouping }
						onChange={ useGrouping => { setAttributes({ useGrouping: (useGrouping ? true : false) }) } }
					/>
					<TextControl
						label={__('Separator', 'getwid')}
						type={ 'string' }
						value={ separator === undefined ? ',' : separator }
						onChange={ separator => setAttributes({ separator }) }
					/>
					<TextControl
						label={__('Decimal', 'getwid')}
						type={ 'string' }
						value={ decimal === undefined ? '.' : decimal }
						onChange={ decimal => setAttributes({ decimal }) }
					/>
					<TextControl
						label={__('Prefix', 'getwid')}
						type={ 'string' }
						value={ prefix === undefined ? 'Up to' : prefix }
						onChange={ prefix => setAttributes({ prefix }) }
					/>
					<TextControl
						label={__('Suffix', 'getwid')}
						type={ 'string' }
						value={ suffix === undefined ? '+' : suffix }
						onChange={ suffix => setAttributes({ suffix }) }
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
						value={easing === undefined ? 'outExpo' : easing }
						onChange={easing => setAttributes({ easing })}
						options={[
							{ value: 'outExpo', label: __('OutExpo', 'getwid') },
							{ value: 'outQuintic', label: __('OutQuintic', 'getwid') },
							{ value: 'outCubic', label: __('OutCubic', 'getwid') }
						]}
					/>
					<SelectControl
						label={__('Numerals', 'getwid')}
						value={numerals === undefined ? 'default' : numerals}
						onChange={numerals => setAttributes({ numerals })}
						options={[
							{ value: 'default', label: __('Default', 'getwid') },
							{ value: 'eastern_arabic', label: __('Eastern Arabic', 'getwid') },
							{ value: 'farsi', label: __('Farsi', 'getwid') }
						]}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}	
}

export default Inspector;