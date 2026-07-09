import {
	BlockAlignmentToolbar,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, Disabled } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import jQuery from 'jquery';

import Inspector from './inspector';
import type { InstagramEditProps } from './types';

import './editor.scss';
import './style.scss';
import { ServerSideRender } from '@wordpress/server-side-render';

const baseClass = 'wp-block-getwid-instagram';

function getTokenURL() {
	return (
		'https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=0&client_id=1815611002603068&redirect_uri=' +
		'https://api.getmotopress.com/get_instagram_token2.php&scope=instagram_business_basic&response_type=code&state=' +
		Getwid.get_instagram_token_url
	);
}

export default function Edit( props: InstagramEditProps ) {
	const { attributes, setAttributes, className } = props;
	const [ tokenIsset, setTokenIsset ] = useState(
		Getwid.settings.instagram_token_isset
	);

	const blockProps = useBlockProps();

	function checkInstagramTokenExistence() {
		jQuery.post(
			Getwid.ajax_url,
			{
				action: 'check_instagram_token',
				data: '',
				nonce: Getwid.nonces.check_instagram_token,
			},
			( response: { data: boolean } ) => {
				const hasToken = !! response.data;

				Getwid.settings.instagram_token_isset = hasToken;
				setTokenIsset( hasToken );
			}
		);
	}

	if ( ! tokenIsset ) {
		return (
			<div { ...blockProps }>
				<form
					className={ `${ className || baseClass }__key-form` }
					onSubmit={ ( event ) => {
						event.preventDefault();
						checkInstagramTokenExistence();
					} }
				>
					<span className="form-title">
						{ __( 'Connect Instagram Account', 'getwid' ) }
					</span>
					<div className="form-wrapper">
						<a
							href={ getTokenURL() }
							target="_blank"
							rel="noreferrer"
							className="components-button is-button is-primary getwid-instagram-auth-button"
						>
							{ __( 'Connect Instagram Account', 'getwid' ) }
						</a>
						<Button variant="secondary" type="submit">
							{ __( 'Update', 'getwid' ) }
						</Button>
					</div>
					<span className="form-description">
						{ __(
							'Click Connect Instagram Account and authorize the app in a new tab to receive access token. Then return to this tab and click Update. You can revoke the granted access any time in your Instagram profile settings.',
							'getwid'
						) }
					</span>
				</form>
			</div>
		);
	}

	return (
		<>
			<Inspector { ...props } />

			<div { ...blockProps }>
				<Disabled>
					<ServerSideRender
						block="getwid/instagram"
						attributes={ attributes }
					/>
				</Disabled>
			</div>
		</>
	);
}
