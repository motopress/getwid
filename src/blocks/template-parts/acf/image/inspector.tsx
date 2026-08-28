import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { TemplateAcfImageEditProps } from './types';

const imageSizeOptions =
	(
		window as unknown as {
			Getwid?: {
				settings?: {
					image_sizes?: Array< { value: string; label: string } >;
				};
			};
		}
	 ).Getwid?.settings?.image_sizes || [];

export default function Inspector( {
	attributes: { customField, linkTo, imageSize },
	setAttributes,
}: TemplateAcfImageEditProps ) {
	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<TextControl
					label={ __( 'Field Name', 'getwid' ) }
					value={ customField || '' }
					onChange={ ( nextCustomField ) =>
						setAttributes( { customField: nextCustomField } )
					}
				/>
				<SelectControl
					label={ __( 'Link to', 'getwid' ) }
					value={ linkTo }
					onChange={ ( nextLinkTo ) =>
						setAttributes( { linkTo: nextLinkTo } )
					}
					options={ [
						{ value: 'none', label: __( 'None', 'getwid' ) },
						{ value: 'post', label: __( 'Post', 'getwid' ) },
					] }
				/>
				<SelectControl
					label={ __( 'Image Size', 'getwid' ) }
					help={ __(
						'For images from Media Library only.',
						'getwid'
					) }
					value={ imageSize }
					onChange={ ( nextImageSize ) =>
						setAttributes( { imageSize: nextImageSize } )
					}
					options={ imageSizeOptions }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
