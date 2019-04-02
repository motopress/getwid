
const {__} = wp.i18n;
const {Component, Fragment} = wp.element;

const {
    InspectorControls,
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
			onStateChange,
			setAttributes,
			
		} = this.props;

		//console.log(changeState);

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Params', 'getwid' ) } initialOpen={false}>
					<TextControl
						label={__('Start', 'getwid')}
						type={ 'number' }
						value={ isNaN(start) ? 0 : parseInt(start) }
						onChange={ start => setAttributes({ start: start.toString() })}
					/>
					<TextControl
						label={__('End', 'getwid')}
						type={ 'number' }
						value={ isNaN(end) ? 0 : parseInt(end) }
						onChange={ end => setAttributes({ end: end.toString() })}
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
						value={ isNaN(duration) ? 0 : parseInt(duration) }
						onChange={ duration => setAttributes({ duration: duration.toString() })}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Options', 'getwid' ) } initialOpen={false}>
					<CheckboxControl
						label='Easing'
						checked={ useEasing }
						onChange={ useEasing => {
							setAttributes({ useEasing: (useEasing ? true : false) })
						}}
					/>
					<CheckboxControl
						label='Grouping'
						checked={ useGrouping }
						onChange={ useGrouping => { setAttributes({ useGrouping: (useGrouping ? true : false) }) } }
					/>
					<TextControl
						label={__('Separator', 'getwid')}
						type={ 'string' }
						value={ separator }
						onChange={ separator => setAttributes({ separator }) }
					/>
					<TextControl
						label={__('Decimal', 'getwid')}
						type={ 'string' }
						value={ decimal }
						onChange={ decimal => setAttributes({ decimal }) }
					/>
					<TextControl
						label={__('Prefix', 'getwid')}
						type={ 'string' }
						value={ prefix }
						onChange={ prefix => setAttributes({ prefix }) }
					/>
					<TextControl
						label={__('Suffix', 'getwid')}
						type={ 'string' }
						value={ suffix }
						onChange={ suffix => setAttributes({ suffix }) }
					/>
				</PanelBody>
				<SelectControl
                    label={__('Easing', 'getwid')}
                    value={ easing }
                    onChange={ easing => setAttributes({ easing })}
                    options={[
                        { value: 'ease_out_expo', label: __( 'EaseOutExpo' , 'getwid' ) },
						{ value: 'out_quintic',   label: __( 'OutQuintic'  , 'getwid' ) },
						{ value: 'out_cubic', 	  label: __( 'OutCubic'    , 'getwid' ) }
                    ]}
                />
				<SelectControl
                    label={__('Numerals', 'getwid')}
                    value={ numerals === undefined ? 'default' : numerals }
                    onChange={ numerals => setAttributes({ numerals })}
                    options={[
                        { value: 'default', 	   label: __( 'Default'    , 'getwid' ) },
						{ value: 'eastern_arabic', label: __( 'Eastern Arabic' , 'getwid' ) },
						{ value: 'farsi', 	  	   label: __( 'Farsi'    	   , 'getwid' ) }
                    ]}
                />
				<Button isPrimary >
					{__('Reset', 'getwid')}
				</Button>
			</InspectorControls>
		);
	}	
}

export default Inspector;