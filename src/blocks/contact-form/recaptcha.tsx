import { InspectorControls } from '@wordpress/block-editor';
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

type GetwidGlobal = {
	ajax_url: string;
	current_user?: {
		can_manage_options?: boolean;
	};
	nonces: {
		recaptcha_v2: string;
	};
	settings: {
		recaptcha_site_key: string;
		recaptcha_secret_key: string;
	};
};

type RecaptchaProps = {
	theme?: string;
	setTheme: ( theme: string ) => void;
};

const getwid = ( window as Window & { Getwid: GetwidGlobal } ).Getwid;

export default function Recaptcha( { theme, setTheme }: RecaptchaProps ) {
	const currentUserCanManageOptions =
		getwid?.current_user?.can_manage_options;
	const [ siteKey, setSiteKey ] = useState(
		getwid.settings.recaptcha_site_key
	);
	const [ secretKey, setSecretKey ] = useState(
		getwid.settings.recaptcha_secret_key
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
				nonce: getwid.nonces.recaptcha_v2,
			};

			getwid.settings.recaptcha_site_key = nextSiteKey;
			getwid.settings.recaptcha_secret_key = nextSecretKey;

			$.post( getwid.ajax_url, data ).done( () => {
				setIsLoading( false );
			} );
		},
		[]
	);

	return (
		<InspectorControls>
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
					__nextHasNoMarginBottom
				/>
				{ currentUserCanManageOptions && (
					<>
						<TextControl
							label={ __( 'reCAPTCHA v2 Site Key', 'getwid' ) }
							value={ siteKey }
							onChange={ setSiteKey }
							__nextHasNoMarginBottom
						/>
						<TextControl
							label={ __( 'reCAPTCHA v2 Secret Key', 'getwid' ) }
							value={ secretKey }
							onChange={ setSecretKey }
							__nextHasNoMarginBottom
						/>
						<BaseControl __nextHasNoMarginBottom>
							<ButtonGroup>
								<Button
									variant="primary"
									disabled={
										siteKey === '' && secretKey === ''
									}
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

						<BaseControl __nextHasNoMarginBottom>
							<ExternalLink href="https://www.google.com/recaptcha/admin/create">
								{ __( 'Get your key.', 'getwid' ) }
							</ExternalLink>
						</BaseControl>
					</>
				) }
			</PanelBody>
		</InspectorControls>
	);
}
