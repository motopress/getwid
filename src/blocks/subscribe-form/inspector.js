/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

const { Component } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;
const { TextControl, PanelBody, BaseControl, ButtonGroup, Button, ExternalLink, CheckboxControl } = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {  } = this.props.attributes;
		const { manageMailchimpApiKey, changeState, getState } = this.props;
		const { textColor, backgroundColor, setTextColor, setBackgroundColor } = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__( 'Settings', 'getwid' )} initialOpen={true}>
					<PanelColorSettings
						title={__( 'Colors', 'getwid' )}
						colorSettings={[
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Button Text Color', 'getwid' )
							},
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __( 'Button Background Color', 'getwid' )
							}
						]}
					/>					
				</PanelBody>

				<PanelBody title={ __( 'Mailchimp API Key', 'getwid' ) } initialOpen={false}>
					<TextControl
						label={__( 'Mailchimp Api Key', 'getwid' )}
						value={getState( 'checkApiKey' )}
						onChange={value => {
							changeState( 'checkApiKey', value );
						}}
					/>
					<BaseControl>
						<ButtonGroup>
							<Button
								isPrimary
								disabled={( getState( 'checkApiKey' ) != '' ? null : true )}
								onClick={
									( event ) => {
										manageMailchimpApiKey( event, 'set' );
									}
								}>
								{__( 'Update', 'getwid' )}
							</Button>

							<Button
								isDefault
								onClick={
									( event ) => {
										changeState( 'checkApiKey', ' ' );
										manageMailchimpApiKey( event, 'delete' );
									}
								}>
								{__( 'Delete', 'getwid' )}
							</Button>
						</ButtonGroup>
					</BaseControl>

					<BaseControl>
						<ExternalLink href={'https://mailchimp.com/'}> {__( 'Get your key.', 'getwid' )} </ExternalLink>
					</BaseControl>

				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;