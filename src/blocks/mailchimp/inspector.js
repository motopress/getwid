/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

/**
 * Internal dependencies
 */
import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.blockEditor || wp.editor;
const { TextControl, PanelBody, BaseControl, ButtonGroup, Button, ExternalLink, SelectControl, Spinner } = wp.components;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const { ids } = this.props.attributes;
		const { manageMailchimpApiKey, setGroupsName, changeData, getData, baseClass } = this.props;
		const { textColor, backgroundColor, setTextColor, setBackgroundColor, setAttributes, customBackgroundColor, customTextColor } = this.props;

		const requestError = getData( 'error' );
		const waitLoadList = getData( 'waitLoadList' );

		return (
			<InspectorControls>
				<PanelBody
						title={__( 'Settings', 'getwid' )}
						initialOpen={true}
				>
					<TextControl
						label={__( 'Mailchimp API Key', 'getwid' )}
						value={getData( 'checkApiKey' )}
						onChange={value => {
							changeData({ checkApiKey: value });
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
								isSecondary
								onClick={
									event => {
										changeData( { checkApiKey: '' } );
										manageMailchimpApiKey( event, 'delete' );
									}
								}
							>
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
							className="getwid-wp56-fix"
							multiple
							size='10'
							label={__( 'Select the lists you wish your visitors to be subscribed to.', 'getwid' )}
							help={__( 'Hold ctrl/cmd to select multiple or deselect', 'getwid' )}
							value={ids}
							onChange={ids => setAttributes( { ids } )}
							options={ ! waitLoadList && ! requestError ? setGroupsName() : [{'value': '', 'label': ''}] }
						/>
					</Fragment>
					<GetwidCustomColorPalette
						colorSettings={[{
								title: __( 'Button Text Color', 'getwid' ),
								colors: {
									customColor: customTextColor,
									defaultColor: textColor
								},
								changeColor: setTextColor
							}, {
								title: __( 'Button Background Color', 'getwid' ),
								colors: {
									customColor: customBackgroundColor,
									defaultColor: backgroundColor
								},
								changeColor: setBackgroundColor
							}
						]}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;