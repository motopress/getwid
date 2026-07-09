import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { ImagesStackEditProps, StackImage } from './types';
import { pickRelevantMediaFile } from './utils';
import { ImageSizeSelect } from 'getwid-components';

type InspectorProps = ImagesStackEditProps & {
	imgObj: Array< StackImage | null >;
	setImagesAttributes: (
		attributes: Partial< ImagesStackEditProps[ 'attributes' ] >
	) => void;
};

export default function Inspector( {
	attributes,
	setImagesAttributes,
	imgObj,
}: InspectorProps ) {
	const { imageSize, linkTo, stackStyle } = attributes;

	function onChangeImageSize( nextImageSize: string ) {
		if ( imgObj.some( ( image ) => ! image ) ) {
			return;
		}

		setImagesAttributes( {
			imageSize: nextImageSize,
			images: imgObj.map( ( image ) =>
				pickRelevantMediaFile( image as StackImage, nextImageSize )
			),
		} );
	}

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
				{ imgObj.length !== 0 && (
					<ImageSizeSelect
						label={ __( 'Image Size', 'getwid' ) }
						help={ __(
							'For images from Media Library only.',
							'getwid'
						) }
						value={ imageSize }
						onChange={ onChangeImageSize }
					/>
				) }
				<SelectControl
					label={ __( 'Style', 'getwid' ) }
					value={ stackStyle }
					onChange={ ( nextStackStyle ) =>
						setImagesAttributes( { stackStyle: nextStackStyle } )
					}
					options={ [
						{ value: 'default', label: __( 'Default', 'getwid' ) },
						{ value: 'alpha', label: __( 'Alpha', 'getwid' ) },
						{ value: 'beta', label: __( 'Beta', 'getwid' ) },
						{ value: 'gamma', label: __( 'Gamma', 'getwid' ) },
						{ value: 'delta', label: __( 'Delta', 'getwid' ) },
						{ value: 'epsilon', label: __( 'Epsilon', 'getwid' ) },
						{ value: 'zeta', label: __( 'Zeta', 'getwid' ) },
					] }
				/>
				<SelectControl
					label={ __( 'Link to', 'getwid' ) }
					value={ linkTo }
					onChange={ ( nextLinkTo ) =>
						setImagesAttributes( { linkTo: nextLinkTo } )
					}
					options={ [
						{ value: 'none', label: __( 'None', 'getwid' ) },
						{
							value: 'attachment',
							label: __( 'Attachment Page', 'getwid' ),
						},
						{ value: 'media', label: __( 'Media File', 'getwid' ) },
					] }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
