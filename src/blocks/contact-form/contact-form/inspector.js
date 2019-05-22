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
	CheckboxControl,
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
				subject,
				captcha,

				nameIsRequired,
				emailIsRequired
			},
			setAttributes,

			backgroundColor,
			setBackgroundColor,

			setTextColor,
			textColor,

			manageRecaptchaAPIKey,
			removeRecaptchaAPIScript,

			changeState,
			getState

		} = this.props;

		const showCaptchaParam = $.parseJSON(captcha);

		return (
			<InspectorControls>
				<PanelBody title={__('Settings', 'getwid')} initialOpen={true}>
					<TextControl
						label={__('Email', 'getwid')}
						value={ to }
						onChange={ to => {
							setAttributes({ to })
						}}
					/>
					<TextControl
						label={__('Subject', 'getwid')}
						value={ subject }
						onChange={ subject => {
							setAttributes({ subject })
						}}
					/>
					<PanelBody title={__('Fields Settings', 'getwid')} initialOpen={true}>
						<ToggleControl
							label={__('Display Title', 'getwid')}
							checked={ nameIsRequired == 'true' ? true : false }
							onChange={ value => {
								setAttributes({ nameIsRequired: value ? 'true' : 'false' });
							}}
						/>
						<ToggleControl
							label={__('Display Title', 'getwid')}
							checked={ emailIsRequired == 'true' ? true : false }
							onChange={ value => {
								setAttributes({ emailIsRequired: value ? 'true' : 'false' });
							}}
						/>
					</PanelBody>
					<CheckboxControl
						label={__('Captcha', 'getwid')}
						checked={ captcha == 'true' ? true : false }
						onChange={ value => {
							setAttributes({ captcha: value ? 'true' : 'false' });
						}}
					/>									
					{
						showCaptchaParam && <BaseControl>
							<TextControl
								label={ __('Recaptcha Site Key', 'getwid') }
								value={ getState('checkSiteKey') }
								onChange={ value => {
									changeState('checkSiteKey', value);
								}}
							/>
							<TextControl
								label={ __('Recaptcha Secret Key', 'getwid') }
								value={ getState('checkSecretKey') }
								onChange={ value => {
									changeState('checkSecretKey', value);
								}}
							/>
							<BaseControl>
								<ButtonGroup>
									<Button
										isPrimary
										disabled={((getState('checkSiteKey') != '' && getState('checkSecretKey') != '') ? null : true)}
										onClick = {
											(event) => {
												removeRecaptchaAPIScript();
												manageRecaptchaAPIKey(event, 'set');
											}
										}>
										{__('Update', 'getwid')}
									</Button>

									<Button isDefault onClick={
										(event) => {
											changeState('checkSiteKey', '');
											changeState('checkSecretKey', '');

											manageRecaptchaAPIKey(event, 'delete');
											removeRecaptchaAPIScript();
										}
									}>
										{__('Delete', 'getwid')}
									</Button>
								</ButtonGroup>
							</BaseControl>

							<BaseControl>
								<ExternalLink href="https://www.google.com/recaptcha/intro/v3.html"> {__('Get your key.', 'getwid')} </ExternalLink>
							</BaseControl>

						</BaseControl>
					}
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
			</InspectorControls>
		);
	}
}

export default Inspector;