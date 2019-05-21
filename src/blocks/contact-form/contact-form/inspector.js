/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const {
	PanelBody,
	TextControl,
	BaseControl,
	ToggleControl,
	ButtonGroup,
	ExternalLink,
	Button

} = wp.components;

const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;

const {
	Component
} = wp.element;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				to,
				subject
			},
			setAttributes,

			backgroundColor,
			setBackgroundColor,

			setTextColor,
			textColor,

			removeGoogleAPIScript,
			manageGoogleAPIKey,

			changeState,
			getState

		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__('Settings', 'getwid')} initialOpen={true}>
					<TextControl
						label={__('Email', 'getwid')}
						value={to}
						onChange={to => {
							setAttributes({ to })
						}}
					/>
					<TextControl
						label={__('Subject', 'getwid')}
						value={subject}
						onChange={subject => {
							setAttributes({ subject })
						}}
					/>
					<PanelColorSettings
						title={__('Color Settings', 'getwid')}
						colorSettings={[
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __('Text Color', 'getwid')
							},
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __('Background Color', 'getwid')
							}
						]}
					/>					
				</PanelBody>
				
				<PanelBody title={__('reCaptcha Api Key', 'getwid')} initialOpen={false}>

					<TextControl
						label={__('Check Site Key', 'getwid')}
						value={getState('checkSiteKey')}
						onChange={value => changeState('checkSiteKey', value)}
					/>
					<TextControl
						label={__('Check Secret Key', 'getwid')}
						value={getState('checkSecretKey')}
						onChange={value => changeState('checkSecretKey', value)}
					/>
					<BaseControl>
						<ButtonGroup>
							<Button
								isPrimary
								disabled={((getState('checkSiteKey') != '' && getState('checkSecretKey') != '') ? null : true)}
								onClick={
									(event) => {
										removeGoogleAPIScript();
										manageGoogleAPIKey(event, 'set');
									}
								}>
								{__('Update', 'getwid')}
							</Button>

							<Button isDefault onClick={
								(event) => {
									changeState('checkSiteKey', '');
									changeState('checkSecretKey', '');
									manageGoogleAPIKey(event, 'delete');
									removeGoogleAPIScript();
								}
							}>
								{__('Delete', 'getwid')}
							</Button>
						</ButtonGroup>
					</BaseControl>
					<BaseControl>
						<ExternalLink href="https://www.google.com/recaptcha/intro/v3.html">{__('Get your key.', 'getwid')}</ExternalLink>
					</BaseControl>

				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;