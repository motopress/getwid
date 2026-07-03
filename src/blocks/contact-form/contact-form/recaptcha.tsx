import {
	BaseControl,
	Button,
	ButtonGroup,
	ExternalLink,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import $ from 'jquery';

type RecaptchaProps = {
	theme?: string;
	setTheme: ( theme: string ) => void;
};

export default function Recaptcha( { theme, setTheme }: RecaptchaProps ) {
	const currentUserCanManageOptions =
		Getwid.ContactForm.user_can_manage_options;
	const [ siteKey, setSiteKey ] = useState(
		Getwid.ContactForm.recaptcha_site_key
	);
	const [ secretKey, setSecretKey ] = useState(
		Getwid.ContactForm.recaptcha_secret_key
	);
	const [ isLoading, setIsLoading ] = useState( false );

	const updateCaptchaCredentials = useCallback(
		( nextSiteKey: string, nextSecretKey: string ) => {
			setIsLoading( true );

			const data = {
				action: 'getwid_update_recaptcha_credentials',
				data: {
					site_key: nextSiteKey,
					secret_key: nextSecretKey,
				},
				nonce: Getwid.ContactForm.nonce,
			};

			Getwid.ContactForm.recaptcha_site_key = nextSiteKey;
			Getwid.ContactForm.recaptcha_secret_key = nextSecretKey;

			$.post( Getwid.ContactForm.ajax_url, data ).done( () => {
				setIsLoading( false );
			} );
		},
		[]
	);

	return (
		<PanelBody
			title={ __( 'reCAPTCHA v2', 'getwid' ) }
			initialOpen={ false }
		>
			<SelectControl
				label={ __( 'Color Theme', 'getwid' ) }
				value={ theme }
				onChange={ setTheme }
				options={ [
					{ value: '', label: __( 'Default', 'getwid' ) },
					{ value: 'dark', label: __( 'Dark', 'getwid' ) },
					{ value: 'light', label: __( 'Light', 'getwid' ) },
				] }
			/>
			{ currentUserCanManageOptions && (
				<>
					<TextControl
						label={ __( 'reCAPTCHA v2 Site Key', 'getwid' ) }
						value={ siteKey }
						onChange={ setSiteKey }
					/>
					<TextControl
						label={ __( 'reCAPTCHA v2 Secret Key', 'getwid' ) }
						value={ secretKey }
						onChange={ setSecretKey }
					/>
					<BaseControl>
						<ButtonGroup>
							<Button
								variant="primary"
								disabled={ siteKey === '' && secretKey === '' }
								onClick={ () =>
									updateCaptchaCredentials(
										siteKey,
										secretKey
									)
								}
								isBusy={ isLoading }
							>
								{ __( 'Update', 'getwid' ) }
							</Button>

							<Button
								variant="secondary"
								onClick={ () => {
									setSiteKey( '' );
									setSecretKey( '' );
									updateCaptchaCredentials( '', '' );
								} }
								isBusy={ isLoading }
							>
								{ __( 'Delete', 'getwid' ) }
							</Button>
						</ButtonGroup>
					</BaseControl>

					<BaseControl>
						<ExternalLink href="https://www.google.com/recaptcha/admin/create">
							{ __( 'Get your key.', 'getwid' ) }
						</ExternalLink>
					</BaseControl>
				</>
			) }
		</PanelBody>
	);
}
