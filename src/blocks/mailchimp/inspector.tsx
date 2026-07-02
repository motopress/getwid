import {
	BaseControl,
	Button,
	ButtonGroup,
	ExternalLink,
	PanelBody,
	SelectControl,
	Spinner,
	TextControl,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import CustomColorPalette from '../../components/custom-color-palette';
import { baseClass, mailchimpApiKeyHelpUrl } from './constants';
import type { MailchimpInspectorProps, MailchimpRuntime } from './types';

const runtimeGlobal = window as MailchimpRuntime;

export default function Inspector( props: MailchimpInspectorProps ) {
	const {
		attributes,
		setAttributes,
		manageMailchimpApiKey,
		setGroupsName,
		getData,
		backgroundColor,
		textColor,
		setTextColor,
		setBackgroundColor,
	} = props;
	const { ids } = attributes;
	const requestError = getData( 'error' );
	const waitLoadList = getData( 'waitLoadList' );

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
				{ !! runtimeGlobal.Getwid?.current_user?.can_manage_options && (
					<TextControl
						label={ __( 'Mailchimp API Key', 'getwid' ) }
						value={ getData( 'apiKey' ) }
						readOnly
						__nextHasNoMarginBottom
					/>
				) }

				{ requestError && (
					<p>
						<span className={ `${ baseClass }__message` }>
							{ `Error for site owner: ${ requestError }` }
						</span>
					</p>
				) }

				<BaseControl>
					<ButtonGroup>
						<Button
							variant="primary"
							disabled={ waitLoadList }
							onClick={ ( event ) =>
								manageMailchimpApiKey( event, 'sync' )
							}
						>
							{ __( 'Sync', 'getwid' ) }
						</Button>
						{ !! runtimeGlobal.Getwid?.current_user
							?.can_manage_options && (
							<Button
								variant="secondary"
								onClick={ ( event ) =>
									manageMailchimpApiKey( event, 'delete' )
								}
							>
								{ __( 'Delete', 'getwid' ) }
							</Button>
						) }
					</ButtonGroup>
				</BaseControl>

				{ !! runtimeGlobal.Getwid?.current_user?.can_manage_options && (
					<BaseControl>
						<ExternalLink href={ mailchimpApiKeyHelpUrl }>
							{ __( 'Get your key.', 'getwid' ) }
						</ExternalLink>
					</BaseControl>
				) }

				{ waitLoadList ? <Spinner /> : undefined }

				<SelectControl
					className="getwid-wp56-fix"
					multiple
					size={ 10 }
					label={ __(
						'Select the lists you wish your visitors to be subscribed to.',
						'getwid'
					) }
					help={ __(
						'Hold ctrl/cmd to select multiple or deselect',
						'getwid'
					) }
					value={ ids }
					onChange={ ( nextIds ) =>
						setAttributes( {
							ids: Array.isArray( nextIds )
								? nextIds
								: [ nextIds ],
						} )
					}
					options={
						! waitLoadList && ! requestError
							? setGroupsName()
							: [ { value: '', label: '' } ]
					}
				/>

				<CustomColorPalette
					colorSettings={ [
						{
							title: __( 'Button Text Color', 'getwid' ),
							colors: {
								customColor: props.attributes.customTextColor,
								defaultColor: textColor,
							},
							changeColor: setTextColor,
						},
						{
							title: __( 'Button Background Color', 'getwid' ),
							colors: {
								customColor:
									props.attributes.customBackgroundColor,
								defaultColor: backgroundColor,
							},
							changeColor: setBackgroundColor,
						},
					] }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
