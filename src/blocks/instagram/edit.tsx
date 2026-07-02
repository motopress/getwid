import { BlockAlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { Button, Disabled } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import jQuery from 'jquery';

import Inspector from './inspector';
import type {
	InstagramEditProps,
	RuntimeGlobal,
	ServerSideRenderProps,
} from './types';

import './editor.scss';
import './style.scss';

const baseClass = 'wp-block-getwid-instagram';
const runtimeGlobal = window as RuntimeGlobal;
const ServerSideRender = runtimeGlobal.wp?.serverSideRender as
	| ( ( props: ServerSideRenderProps ) => JSX.Element )
	| undefined;

function getTokenURL() {
	return (
		'https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=0&client_id=1815611002603068&redirect_uri=' +
		'https://api.getmotopress.com/get_instagram_token2.php&scope=instagram_business_basic&response_type=code&state=' +
		runtimeGlobal.Getwid.get_instagram_token_url
	);
}

export default function Edit( props: InstagramEditProps ) {
	const { attributes, setAttributes, className } = props;
	const { align } = attributes;
	const [ tokenIsset, setTokenIsset ] = useState(
		runtimeGlobal.Getwid.settings.instagram_token_isset
	);

	function checkInstagramTokenExistence() {
		jQuery.post(
			runtimeGlobal.Getwid.ajax_url,
			{
				action: 'check_instagram_token',
				data: '',
				nonce: runtimeGlobal.Getwid.nonces.check_instagram_token,
			},
			( response: { data: boolean } ) => {
				const hasToken = !! response.data;

				runtimeGlobal.Getwid.settings.instagram_token_isset = hasToken;
				setTokenIsset( hasToken );
			}
		);
	}

	if ( ! tokenIsset ) {
		return (
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
		);
	}

	return (
		<>
			<BlockControls>
				<BlockAlignmentToolbar
					value={ align }
					controls={ [ 'wide', 'full' ] }
					onChange={ ( nextAlign ) =>
						setAttributes( { align: nextAlign } )
					}
				/>
			</BlockControls>
			<Inspector { ...props } />
			<Disabled>
				{ ServerSideRender && (
					<ServerSideRender
						block="getwid/instagram"
						attributes={ attributes }
					/>
				) }
			</Disabled>
		</>
	);
}
