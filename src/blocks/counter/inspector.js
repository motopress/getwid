/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* Internal dependencies
*/
import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';
import GetwidCustomTabsControl  from 'GetwidControls/custom-tabs-control';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { CheckboxControl, TextControl, SelectControl, PanelBody } = wp.components;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);

		this.changeState = this.changeState.bind( this );

		this.state = {
			tabName: 'general'
		};
	}

	changeState(param, value) {
		if (typeof param == 'object') {
			this.setState(param);
		} else if (typeof param == 'string') {
			this.setState({[param]: value});
		}
	}

	render() {
		const { start, end, decimalPlaces, duration, useEasing, useGrouping, customTextColor } = this.props.attributes;
		const { separator, decimal, easing, numerals } = this.props.attributes;
		const { setAttributes, textColor, setTextColor } = this.props;

		const { tabName } = this.state;
		const { changeState } = this;

		return (
			<InspectorControls>
				<GetwidCustomTabsControl
					state={tabName}
					stateName='tabName'
					onChangeTab={changeState}
					tabs = {[ 'general', 'style' ]}
				/>
				{ tabName === 'general' && (
					<Fragment>
						<PanelBody>
							<TextControl
								type='number'
								label={__( 'Start', 'getwid' )}
								value={ parseInt( start ) || 0 }
								onChange={value => {
									setAttributes({ start: value.toString() })
								}}
							/>
							<TextControl
								type='number'
								label={__( 'End', 'getwid' )}
								value={ parseInt( end ) || 100 }
								onChange={value => {
									setAttributes({ end: value.toString() })
								}}
							/>
							<TextControl
								type='number'
								label={__( 'Animation Duration', 'getwid' )}
								value={isNaN( duration ) ? 3 : parseInt( duration )}
								onChange={value => {
									setAttributes({ duration: value.toString() })
								}}
							/>
							<CheckboxControl
								label={__( 'Smooth Animation', 'getwid' )}
								checked={ useEasing === 'true' ? true : false }
								onChange={ value => {
									setAttributes({ useEasing: value ? 'true' : 'false' })
								}}
							/>
						</PanelBody>
					</Fragment>
				) }

				{ tabName === 'style' && (
					<Fragment>
						<PanelBody>
							<SelectControl
								label={__( 'Animation Effect', 'getwid' )}
								value={ easing === undefined ? 'outExpo' : easing }
								onChange={easing => {
									setAttributes({ easing })
								}}
								options={[
									{ value: 'outExpo',    label: 'OutExpo'    },
									{ value: 'outQuintic', label: 'OutQuintic' },
									{ value: 'outCubic',   label: 'OutCubic'   }
								]}
							/>
							<CheckboxControl
								label={__( 'Display Thousands Separator', 'getwid' )}
								checked={ useGrouping === 'true' ? true : false }
								onChange={ value => {
									setAttributes( { useGrouping: value ? 'true' : 'false' } )
								}}
							/>
							<TextControl
								label={__( 'Thousands Separator', 'getwid' )}
								value={ separator === undefined ? _x( ',', 'Thousands separator', 'getwid' ) : separator }
								onChange={ separator => {
									setAttributes({ separator })
								}}
							/>
							<GetwidCustomColorPalette
								colorSettings={[{
										title: __( 'Color', 'getwid' ),
										colors: {
											customColor: customTextColor,
											defaultColor: textColor
										},
										changeColor: setTextColor
									}
								]}
							/>
							<TextControl
								type='number'
								label={__( 'Decimal Places', 'getwid' )}
								value={ isNaN( decimalPlaces ) ? 0 : (parseInt( decimalPlaces ) < 0 ? 0 : parseInt( decimalPlaces ) )  }
                                onChange={ value => {
									value = (value > 100) ? 100 : (value < 0) ? 0 : value;
                                    setAttributes({ decimalPlaces: parseInt( value ) ? (parseInt( value ) < 0 ? '0' : value.toString()) : '0' })
                                }}
							/>
							<TextControl
								label={__( 'Decimal Separator', 'getwid' )}
								value={ decimal === undefined ? _x( '.', 'Decimal separator', 'getwid' ) : decimal }
								onChange={ decimal => {
									setAttributes({ decimal })
								}}
							/>
							<SelectControl
								label={__( 'Numerals', 'getwid' )}
								value={numerals === undefined ? 'default' : numerals}
								onChange={numerals => {
									setAttributes({ numerals })
								}}
								options={[
									{ value: 'default', 	   label: __( 'Default'       , 'getwid') },
									{ value: 'eastern_arabic', label: __( 'Eastern Arabic', 'getwid') },
									{ value: 'farsi', 		   label: __( 'Farsi'         , 'getwid') }
								]}
							/>
						</PanelBody>
					</Fragment>
				)}
			</InspectorControls>
		);
	}
}

export default Inspector;