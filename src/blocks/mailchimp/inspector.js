/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

const { Component, Fragment } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;
const { TextControl, PanelBody, BaseControl, ButtonGroup, Button, ExternalLink, SelectControl, Spinner } = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);		
	}

	render() {
		const { ids } = this.props.attributes;
		const { manageMailchimpApiKey, setGroupsName, changeData, getData, baseClass } = this.props;
		const { textColor, backgroundColor, setTextColor, setBackgroundColor, setAttributes } = this.props;

		const requestError = getData( 'error' );
		const waitLoadList = getData( 'waitLoadList' );

		return (
			<InspectorControls>
				<PanelBody title={__( 'Settings', 'getwid' )} initialOpen={true}>
				
					<TextControl
						label={__( 'Mailchimp API Key', 'getwid' )}
						value={getData( 'checkApiKey' )}
						onChange={value => {
							changeData( { checkApiKey: value } );
						}}
					/>
					{ requestError && (
						<p><span className={`${baseClass}__message`}>{`Error for site owner: ${requestError}`}</span></p>
					) }

					<BaseControl>
						<ButtonGroup>
							<Button
								isPrimary
								disabled={waitLoadList}
								onClick={
									event => manageMailchimpApiKey( event, 'sync' )
								}>
								{__( 'Sync', 'getwid' )}
							</Button>
							<Button
								isDefault
								onClick={
									event => {
										changeData( { checkApiKey: '' } );
										manageMailchimpApiKey( event, 'delete' );
									}
								}>
								{__( 'Delete', 'getwid' )}
							</Button>						
						</ButtonGroup>
					</BaseControl>

					<BaseControl>
						<ExternalLink href={'https://mailchimp.com/help/about-api-keys/#Find_or_Generate_Your_API_Key'}> {__( 'Get your key.', 'getwid' )} </ExternalLink>
					</BaseControl>

					<Fragment>
						{ waitLoadList ? <Spinner/> : undefined }
						<SelectControl
							multiple
							size='10'
							label={__( 'Select the lists you wish your visitors to be subscribed to.', 'getwid' )}
							help={__( 'Hold ctrl/cmd to select multiple or deselect', 'getwid' )}
							value={ids}
							onChange={ids => setAttributes( { ids } )}
							options={ ! waitLoadList && ! requestError ? setGroupsName() : [{'value': '', 'label': ''}] }
						/>
					</Fragment>
				
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
			</InspectorControls>
		);
	}
}

export default Inspector;