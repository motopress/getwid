/**
* Internal dependencies
*/
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidFontsControl from 'GetwidControls/fonts-control';
import GetwidCustomTabsControl  from 'GetwidControls/custom-tabs-control';

import { renderFontSizePanel } from 'GetwidUtils/render-inspector';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { PanelBody, SelectControl, DateTimePicker, ToggleControl } = wp.components;
const { InspectorControls, PanelColorSettings } = wp.blockEditor || wp.editor;

/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );

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

		const { dateTime, years, months, weeks, days, hours, minutes, seconds, fontFamily, fontWeight } = this.props.attributes;
		const { fontStyle, textTransform, lineHeight, letterSpacing, backgroundColor, innerPadding, innerSpacings } = this.props.attributes;
		const { setTextColor,textColor, setAttributes } = this.props;

		const defaultDate = new Date( Getwid.settings.date_time_utc.replace(/-/g, "/") );

		defaultDate.setDate( defaultDate.getDate() + 1 );

		const { tabName } = this.state;
		const { changeState } = this;

		return (
			<InspectorControls>
				<GetwidCustomTabsControl
					state={tabName}
					stateName='tabName'
					onChangeTab={changeState}
					tabs={[ 'general', 'style' ]}
				/>
				{ tabName === 'general' && (
					<Fragment>
						<PanelBody initialOpen={true}>
							<DateTimePicker
								currentDate={dateTime ? dateTime : defaultDate}
								onChange={value => {
									setAttributes({ dateTime: value });
								}}
								__nextRemoveHelpButton={true}
								__nextRemoveResetButton={true}
							/>
							<ToggleControl
								label={__( 'Years', 'getwid' )}
								checked={years}
								onChange={value => {
									setAttributes({ years: value });
								}}
							/>
							<ToggleControl
								label={__( 'Months', 'getwid' )}
								checked={months}
								onChange={value => {
									setAttributes({ months: value });
								}}
							/>
							<ToggleControl
								label={__( 'Weeks', 'getwid' )}
								checked={weeks}
								onChange={value => {
									setAttributes({ weeks: value });
								}}
							/>
							<ToggleControl
								label={__( 'Days', 'getwid' )}
								checked={days}
								onChange={value => {
									setAttributes({ days: value });
								}}
							/>
							<ToggleControl
								label={__( 'Hours', 'getwid' )}
								checked={hours}
								onChange={value => {
									setAttributes({ hours: value });
								}}
							/>
							<ToggleControl
								label={__( 'Minutes', 'getwid' )}
								checked={minutes}
								onChange={value => {
									setAttributes({ minutes: value });
								}}
							/>
							<ToggleControl
								label={__( 'Seconds', 'getwid' )}
								checked={seconds}
								onChange={value => {
									setAttributes({ seconds: value });
								}}
							/>
						</PanelBody>
					</Fragment>
				) }

				{ tabName === 'style' && (
					<Fragment>
						<PanelBody title={__( 'Font Settings', 'getwid' )} initialOpen={true}>
							<GetwidFontsControl
								label={__( 'Font Family', 'getwid' )}
								value={fontFamily}
								onChangeFontGroupID={value => {
									setAttributes({
										fontGroupID: value,
									});
								}}
								onChangeFontFamily={value => {
									setAttributes({
										fontFamily: value,
										fontWeight: 'normal'
									});
								}}
								valueWeight={fontWeight}
								onChangeFontWeight={value => {
									setAttributes({ fontWeight: value });
								}}
							/>

							{renderFontSizePanel( this )}

							<SelectControl
								label={__( 'Font Style', 'getwid' )}
								value={fontStyle}
								options={[
									{ value: 'normal' , label: __( 'Normal' , 'getwid' ) },
									{ value: 'italic' , label: __( 'Italic' , 'getwid' ) },
									{ value: 'inherit', label: __( 'Inherit', 'getwid' ) }
								]}
								onChange={fontStyle => setAttributes({ fontStyle })}
							/>
							<SelectControl
								label={__( 'Text Transform', 'getwid' )}
								value={textTransform}
								options={[
									{ value: 'default'  , label: __( 'Default'  , 'getwid' ) },
									{ value: 'uppercase', label: __( 'Uppercase', 'getwid' ) },
									{ value: 'lowercase', label: __( 'Lowercase', 'getwid' ) }
								]}
								onChange={textTransform => setAttributes({ textTransform })}
							/>
							<GetwidStyleLengthControl
								label={__( 'Line Height', 'getwid' )}
								value={lineHeight}
								onChange={lineHeight => {
									setAttributes( { lineHeight } );
								}}
							/>
							<GetwidStyleLengthControl
								label={__( 'Letter Spacing', 'getwid' )}
								value={letterSpacing}
								allowNegative={true}
								units={[
									{ label: 'px', value: 'px' },
									{ label: 'em', value: 'em' },
									{ label: 'pt', value: 'pt' },
									{ label: 'vh', value: 'vh' },
									{ label: 'vw', value: 'vw' }
								]}
								onChange={letterSpacing => {
									setAttributes({ letterSpacing });
								}}
							/>
						</PanelBody>

						<PanelBody title={__( 'Layout', 'getwid' )} initialOpen={false}>
							<SelectControl
								label={__( 'Space around numbers', 'getwid' )}
								value={innerPadding}
								options={[
									{ value: 'default', label: __( 'Default', 'getwid' ) },
									{ value: 'small'  , label: __( 'Small'  , 'getwid' ) },
									{ value: 'medium' , label: __( 'Medium' , 'getwid' ) },
									{ value: 'normal' , label: __( 'Normal' , 'getwid' ) },
									{ value: 'large'  , label: __( 'Large'  , 'getwid' ) }
								]}
								onChange={innerPadding => setAttributes({ innerPadding })}
							/>
							<SelectControl
								label={__( 'Space between numbers', 'getwid' )}
								value={innerSpacings}
								options={[
									{ value: 'none'  , label: __( 'None'  , 'getwid' ) },
									{ value: 'small' , label: __( 'Small' , 'getwid' ) },
									{ value: 'medium', label: __( 'Medium', 'getwid' ) },
									{ value: 'normal', label: __( 'Normal', 'getwid' ) },
									{ value: 'large' , label: __( 'Large' , 'getwid' ) }
								]}
								onChange={innerSpacings => setAttributes({ innerSpacings })}
							/>
						</PanelBody>
						<PanelColorSettings
							title={__( 'Colors', 'getwid' )}
							initialOpen={false}
							colorSettings={[
								{
									value: textColor.color,
									onChange: setTextColor,
									label: __( 'Text Color', 'getwid' )
								},
								{
									value: backgroundColor,
									onChange: value => {
										setAttributes({ backgroundColor: value });
									},
									label: __( 'Background Color', 'getwid' )
								}
							]}
						/>
					</Fragment>
				) }
			</InspectorControls>
		);
	}
}

export default Inspector;
