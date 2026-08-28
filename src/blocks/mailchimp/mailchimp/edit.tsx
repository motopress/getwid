import {
	InnerBlocks,
	RichText,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import { Button, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';
import jQuery from 'jquery';

import {
	baseClass,
	allowedBlocks,
	allowedFormats,
	mailchimpTemplate,
	mailchimpApiKeyHelpUrl,
} from './constants';
import Inspector from './inspector';
import type {
	MailchimpApiKeyAction,
	MailchimpEditProps,
	MailchimpList,
	MailchimpState,
} from './types';

import './editor.scss';
import './style.scss';

function Edit( props: MailchimpEditProps ) {
	const { attributes, setAttributes, backgroundColor, textColor } = props;
	const initialApiKey = Getwid.settings.mailchimp_api_key;
	const [ state, setState ] = useState< MailchimpState >( {
		apiKey: initialApiKey,
		waitLoadList: true,
		error: '',
		list: [],
	} );

	const blockProps = useBlockProps();

	function changeData( data: Partial< MailchimpState > ) {
		setState( ( current ) => ( {
			...current,
			...data,
		} ) );
	}

	function getData< K extends keyof MailchimpState >( key: K ) {
		return state[ key ];
	}

	function setGroupsName() {
		const options: Array< { value: string; label: string } > = [];

		if ( state.list.length ) {
			state.list.forEach( ( item ) => {
				options.push( { value: item.id, label: item.title } );

				const listId = item.id;

				item.categories?.forEach( ( category ) => {
					category.interests?.forEach( ( interest ) => {
						options.push( {
							value: `${ listId }/${ interest.id }`,
							label: interest.title,
						} );
					} );
				} );
			} );
		}

		return options;
	}

	function manageMailchimpApiKey(
		event: { preventDefault?: () => void } | null,
		option: MailchimpApiKeyAction
	) {
		event?.preventDefault?.();

		const data = {
			action: 'getwid_mailchimp_api_key_manage',
			data: {
				api_key: getData( 'apiKey' ),
			},
			option,
			nonce: Getwid.nonces.mailchimp_api_key || '',
		};

		changeData( { waitLoadList: true } );

		jQuery.post(
			Getwid.ajax_url,
			data,
			(
				response:
					| {
							success: true;
							data: MailchimpList[];
					  }
					| {
							success: false;
							data: string;
					  }
			) => {
				changeData( { waitLoadList: false } );

				if ( ! response.success ) {
					changeData( {
						error: response.data,
					} );
					return;
				}

				switch ( option ) {
					case 'save':
						Getwid.settings.mailchimp_api_key = getData( 'apiKey' );
					// fall through
					case 'sync':
					case 'load':
						changeData( {
							error: '',
							list: response.data,
						} );
						break;
					case 'delete':
						Getwid.settings.mailchimp_api_key = '';
						changeData( {
							error: '',
							apiKey: '',
							list: [],
						} );
						break;
				}
			}
		);
	}

	useEffect( () => {
		if ( initialApiKey !== '' ) {
			manageMailchimpApiKey( null, 'load' );
		}
	}, [] );

	if ( Getwid.settings.mailchimp_api_key === '' ) {
		if ( ! Getwid.current_user.can_manage_options ) {
			return (
				<div { ...blockProps }>
					<p>
						{ __(
							'Contact the site administrator to set up the required keys.',
							'getwid'
						) }
					</p>
				</div>
			);
		}

		return (
			<div { ...blockProps }>
				<form
					className={ `${ baseClass }__key-form` }
					onSubmit={ ( event ) =>
						manageMailchimpApiKey( event, 'save' )
					}
				>
					<span className="form-title">
						{ __( 'Mailchimp API key.', 'getwid' ) }{ ' ' }
						<a
							href={ mailchimpApiKeyHelpUrl }
							target="_blank"
							rel="noreferrer"
						>
							{ __( 'Get your key.', 'getwid' ) }
						</a>
					</span>

					<div className="form-wrapper">
						<TextControl
							placeholder={ __( 'Mailchimp API Key', 'getwid' ) }
							value={ state.apiKey }
							onChange={ ( nextApiKey ) =>
								changeData( { apiKey: nextApiKey } )
							}
							__nextHasNoMarginBottom
						/>

						<Button
							variant="primary"
							type="submit"
							disabled={ state.apiKey === '' }
						>
							{ __( 'Save API Key', 'getwid' ) }
						</Button>
					</div>

					{ state.error && (
						<span className="form-description">
							{ state.error }
						</span>
					) }
				</form>
			</div>
		);
	}
	const buttonSubmitClass = clsx( 'wp-block-button__link', {
		'has-background': !! backgroundColor.color,
		[ backgroundColor.class || '' ]: !! backgroundColor.class,
		'has-text-color': !! textColor.color,
		[ textColor.class || '' ]: !! textColor.class,
	} );

	return (
		<>
			<Inspector
				{ ...props }
				manageMailchimpApiKey={ manageMailchimpApiKey }
				setGroupsName={ setGroupsName }
				getData={ getData }
			/>
			<div { ...blockProps }>
				<div className={ `${ baseClass }__wrapper` }>
					<InnerBlocks
						templateInsertUpdatesSelection={ false }
						allowedBlocks={ allowedBlocks }
						template={ mailchimpTemplate }
					/>
				</div>
				<div className="wp-block-button">
					<RichText
						placeholder={ __( 'Write text…', 'getwid' ) }
						value={ attributes.text }
						allowedFormats={ allowedFormats }
						onChange={ ( text ) => setAttributes( { text } ) }
						className={ buttonSubmitClass }
						style={ {
							backgroundColor: backgroundColor.color,
							color: textColor.color,
						} }
					/>
				</div>
			</div>
		</>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )( Edit );
