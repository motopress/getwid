import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ImageSizeSelect, MediaControl } from 'getwid-components';

import type { MediaObject, PersonEditProps } from './types';

type InspectorProps = PersonEditProps & {
	onSelectMedia: ( media: MediaObject ) => void;
	changeImageSize: ( media: MediaObject, imageSize: string ) => void;
};

export default function Inspector( {
	attributes,
	setAttributes,
	onSelectMedia,
	changeImageSize,
	imgObj,
}: InspectorProps ) {
	const { imageSize, imageCrop, imgId, imgUrl } = attributes;

	function onChangeImageSize( nextImageSize: string ) {
		if ( imgObj ) {
			setAttributes( { imageSize: nextImageSize } );
			changeImageSize( imgObj, nextImageSize );
		}
	}

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<MediaControl< MediaObject >
					label={ __( 'Image', 'getwid' ) }
					removeButton={ false }
					url={ imgUrl }
					id={ imgId }
					onSelectMedia={ onSelectMedia }
					onRemoveMedia={ () =>
						setAttributes( {
							imgUrl: undefined,
							imgId: undefined,
						} )
					}
				/>
				{ imgObj && (
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
				<ToggleControl
					label={ __( 'Crop Image', 'getwid' ) }
					checked={ imageCrop }
					onChange={ () => {
						setAttributes( { imageCrop: ! imageCrop } );
					} }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
