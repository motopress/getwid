/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

const { Component, Fragment } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;
const { TextControl, PanelBody, BaseControl, ButtonGroup, Button, ExternalLink, SelectControl } = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);		
	}

	render() {
		const { ids } = this.props.attributes;
		const { manageMailchimpApiKey, setGroupsNames, changeData, getData, baseClass } = this.props;
		const { textColor, backgroundColor, setTextColor, setBackgroundColor, setAttributes } = this.props;

		const requestError = getData( 'error' );

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

				{ ! requestError && (
						<PanelBody title={__( 'Group settings', 'getwid' )} initialOpen={true}>
							<SelectControl
								multiple
								size='10'
								label={__( 'Select lists and groups', 'getwid' )}
								help={__( 'In order to display multiple points hold ctrl/cmd button.', 'getwid' )}
								value={ids}
								onChange={ids => setAttributes( { ids } )}
								options={setGroupsNames()}
							/>
						</PanelBody>
				) }
				
				<PanelBody title={ __( 'Mailchimp API Key', 'getwid' ) } initialOpen={false}>
					<TextControl
						label={__( 'Mailchimp Api Key', 'getwid' )}
						value={getData( 'checkApiKey' )}
						onChange={value => {
							changeData( 'checkApiKey', value );
						}}
					/>
					{ requestError && (
						<p><span className={`${baseClass}__message`} >{`Error for site owner: ${requestError}`}</span></p>
					) }

					<BaseControl>
						<ButtonGroup>
							<Button
								isPrimary
								onClick={
									( event ) => {
										manageMailchimpApiKey( event, 'sync' );
									}
								}>
								{__( 'Sync', 'getwid' )}
							</Button>
							<Button
								isDefault
								onClick={
									( event ) => {
										changeData( 'checkApiKey', '' );
										manageMailchimpApiKey( event, 'delete' );
									}
								}>
								{__(' Delete', 'getwid' )}
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