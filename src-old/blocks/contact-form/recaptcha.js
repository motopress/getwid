import { __ } from 'wp.i18n';
const { jQuery: $ } = window;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { useState, useCallback } = wp.element;
const { Button, TextControl, PanelBody, ButtonGroup, BaseControl, ExternalLink, SelectControl } = wp.components;

export default function Recaptcha( props ) {

	const currentUserCanManageOptions = Getwid?.current_user?.can_manage_options;
	const [ siteKey, setSiteKey ] = useState( Getwid.settings.recaptcha_site_key );
	const [ secretKey, setSecretKey ] = useState( Getwid.settings.recaptcha_secret_key );

	const [ isLoading, setIsLoading ] = useState( false );

	const updateCaptchaCredentials = useCallback( ( siteKey, secretKey ) => {

		setIsLoading( true );

		const data = {
			action: 'getwid_update_recaptcha_credentials',
			data: {
				site_key: siteKey,
				secret_key: secretKey
			},
			nonce: Getwid.nonces.recaptcha_v2
		};

		Getwid.settings.recaptcha_site_key = siteKey;
		Getwid.settings.recaptcha_secret_key = secretKey;

		$.post( Getwid.ajax_url, data )
			.done(() => {
				setIsLoading( false );
			});

	}, [] );

	return (

		<InspectorControls>
			<PanelBody title={ __( 'reCAPTCHA v2', 'getwid' ) } initialOpen={ false }>

				<SelectControl
					label={ __( 'Color Theme', 'getwid' ) }
					value={ props.theme }
					onChange={ theme => {
						props.setTheme( theme );
					}}
					options={[
						{ value: '' , label: __( 'Default' , 'getwid' ) },
						{ value: 'dark' , label: __( 'Dark' , 'getwid' ) },
						{ value: 'light', label: __( 'Light', 'getwid' ) }
					]}
				/>
				{ currentUserCanManageOptions && (
					<>
						<TextControl
							label={ __( 'reCAPTCHA v2 Site Key', 'getwid' ) }
							value={ siteKey }
							onChange={ value => {
								setSiteKey( value );
							}}
						/>
						<TextControl
							label={ __( 'reCAPTCHA v2 Secret Key', 'getwid' ) }
							value={ secretKey }
							onChange={ value => {
								setSecretKey( value )
							}}
						/>
						<BaseControl>
							<ButtonGroup>
								<Button
									isPrimary
									disabled={ siteKey == '' && secretKey == ''  }
									onClick={ () => { updateCaptchaCredentials( siteKey, secretKey ) } }
									isBusy={ isLoading }
								>
									{ __( 'Update', 'getwid' ) }
								</Button>

								<Button
									isSecondary
									onClick={ () => {
											setSiteKey('');
											setSecretKey('');
											updateCaptchaCredentials( '', '' );
									} }
									isBusy={ isLoading }
								>
									{ __( 'Delete', 'getwid' ) }
								</Button>
							</ButtonGroup>
						</BaseControl>

						<BaseControl>
							<ExternalLink href={ 'https://www.google.com/recaptcha/admin/create' }> { __( 'Get your key.', 'getwid' ) } </ExternalLink>
						</BaseControl>
					</>
				)}
			</PanelBody>
		</InspectorControls>
	)
}
