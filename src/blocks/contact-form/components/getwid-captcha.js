/**
* Internal dependencies
*/
import { addScript } from 'GetwidUtils/help-functions';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { isEqual } from 'lodash';

const { InspectorControls } = wp.editor;
const { Component, Fragment } = wp.element;
const { Button, TextControl, Disabled, PanelBody, ButtonGroup, BaseControl, ExternalLink, SelectControl } = wp.components;

/**
* Create an Component
*/
class GetwidCaptcha extends Component {

	constructor() {
		super(...arguments);

		this.state = {
			recaptchaSiteKey  : Getwid.settings.recaptcha_site_key   != '' ? Getwid.settings.recaptcha_site_key   : '',
			recaptchaSecretKey: Getwid.settings.recaptcha_secret_key != '' ? Getwid.settings.recaptcha_secret_key : '',
	
			checkSiteKey  : Getwid.settings.recaptcha_site_key   != '' ? Getwid.settings.recaptcha_site_key   : ' ',
			checkSecretKey: Getwid.settings.recaptcha_secret_key != '' ? Getwid.settings.recaptcha_secret_key : '',
	
			updateCaptcha: false
		};
	}

	/* #region manage captcha */
	manageRecaptchaAPIKey = (event, option) => {
		event.preventDefault();

		const { getState, changeState, deleteCaptchaElement } = this;

		const data = {
			'action': 'getwid_recaptcha_api_key',
			'data': {
				'site_api_key'  : getState( 'checkSiteKey'   ),
				'secret_api_key': getState( 'checkSecretKey' )
			},
			'option': option,
			'nonce': Getwid.nonces.recaptcha_v2_contact_form
		};

		deleteCaptchaElement();

		if ( option == 'set' ) {

			Getwid.settings.recaptcha_site_key   = getState( 'checkSiteKey'   );
			Getwid.settings.recaptcha_secret_key = getState( 'checkSecretKey' );

		} else if ( option == 'delete' ) {

			Getwid.settings.recaptcha_site_key = '';
			Getwid.settings.recaptcha_secret_key = '';
		}

		changeState( 'updateCaptcha', true );

		$.post( Getwid.ajax_url, data );
	}

	renderCaptcha = () => {
		const { changeState, getState } = this;
		const { attributes: { theme }, baseClass } = this.props;

		grecaptcha.ready( () => {
			const captcha = $( `.${baseClass}__reCAPTCHA` )[ 0 ];
			this.captchaId = grecaptcha.render(captcha, {
				'sitekey': getState( 'checkSiteKey' ),
				'theme'  : theme
			});
			changeState( 'updateCaptcha', false );
		});
	}

	addRecaptchaAPIScript = () => {
		const { addCaptchaElement, renderCaptcha } = this;

		addCaptchaElement();
		addScript( 'https://www.google.com/recaptcha/api.js?render=explicit&hl=en', script => {
			script.id = 'reCAPTCHA_api_js';
			renderCaptcha();
		});
	}

	removeRecaptchaAPIScript = () => {
		const $main_google_js = $( '#reCAPTCHA_api_js' );

		if ( $main_google_js.length ) {
			$main_google_js.remove();
		}

		const $other_google_js = $( 'script[src*=\'www.gstatic.com\']' );

		if ( $other_google_js.length ) {
			$.each( $other_google_js, (index, value) => {
				$( value ).remove();
			});
		}

		window.grecaptcha = {};
	}
	/* #endregion */

	/* #region manage captcha element */
	addCaptchaElement = () => {
		const { className, baseClass } = this.props;
		const captchaElement = document.createElement( 'div' );

		$( captchaElement ).addClass( `${baseClass}__reCAPTCHA` );
		$( `.${className}` ).find( `.${className}__wrapper` ).after( $( captchaElement ) );
	}

	deleteCaptchaElement = () => {
		const { baseClass } = this.props;
		$( `.${baseClass}__reCAPTCHA` ).remove();
	}
	/* #endregion */

	changeState = (param, value) => {
		this.setState( { [ param ]: value } );
	}

	getState = (value) => {
		return this.state[ value ];
	}

	componentDidUpdate(prevProps, prevState) {
		const { attributes: { theme } } = this.props;
		const { addCaptchaElement, renderCaptcha, getState } = this;

		if ( prevProps.isSelected === this.props.isSelected ) {
			if ( getState( 'updateCaptcha' ) || !isEqual( theme, prevProps.attributes.theme ) ) {
				addCaptchaElement();
				renderCaptcha();
			}
		}
	}

	componentDidMount() {
		this.addRecaptchaAPIScript();
	}

	componentWillUnmount() {
		this.removeRecaptchaAPIScript();
	}

	render() {

		const { theme } = this.props.attributes;
		const { className, captchaClass, setAttributes } = this.props;

		const { getState, changeState } = this;
		const { deleteCaptchaElement, manageRecaptchaAPIKey } = this;

		return (
			<Fragment>
				<div className={ `${className}` }>
					<Disabled>
						<div className={ `${captchaClass}__wrapper` }></div>
					</Disabled>
				</div>

				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'getwid' ) }>

						<BaseControl>
							<SelectControl
								label={ __( 'Color Theme', 'getwid' ) }
								value={ theme }
								onChange={ theme => {
									deleteCaptchaElement();
									setAttributes( { theme } );
								}}
								options={[
									{ value: 'dark' , label: __( 'Dark' , 'getwid' ) },
									{ value: 'light', label: __( 'Light', 'getwid' ) }
								]}
							/>
							<TextControl
								label={ __( 'Recaptcha Site Key', 'getwid' ) }
								value={ getState( 'checkSiteKey' ) }
								onChange={ value => {
									changeState( 'checkSiteKey', value );
								}}
							/>
							<TextControl
								label={ __( 'Recaptcha Secret Key', 'getwid' ) }
								value={ getState( 'checkSecretKey' ) }
								onChange={ value => {
									changeState( 'checkSecretKey', value );
								}}
							/>
						</BaseControl>

						<BaseControl>
							<ButtonGroup>
								<Button
									isPrimary
									disabled={ ( getState( 'checkSiteKey' ) != '' && getState( 'checkSecretKey' ) != ''  ? null : true) }
									onClick={
										(event) => {
											manageRecaptchaAPIKey( event, 'set' );
										}
									}>
									{ __( 'Update', 'getwid' ) }
								</Button>

								<Button isDefault onClick={
									(event) => {
										changeState( 'checkSiteKey'  , ' ' );
										changeState( 'checkSecretKey', ''  );

										manageRecaptchaAPIKey( event, 'delete' );
									}
								}>
									{ __( 'Delete', 'getwid' ) }
								</Button>
							</ButtonGroup>
						</BaseControl>

						<BaseControl>
							<ExternalLink href={ 'https://www.google.com/recaptcha/intro/v3.html' }> { __( 'Get your key.', 'getwid' ) } </ExternalLink>
						</BaseControl>

					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
}

export default GetwidCaptcha;