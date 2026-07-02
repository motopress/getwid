import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { MediaControl } from 'getwid-components';

import type { MediaObject, PersonEditProps } from './types';

type InspectorProps = PersonEditProps & {
	onSelectMedia: ( media: MediaObject ) => void;
	changeImageSize: ( media: MediaObject, imageSize: string ) => void;
};

const imageSizeOptions =
	(
		window as Window & {
			Getwid?: {
				settings?: {
					image_sizes?: Array< { value: string; label: string } >;
				};
			};
		}
	 ).Getwid?.settings?.image_sizes || [];

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
					<SelectControl
						label={ __( 'Image Size', 'getwid' ) }
						help={ __(
							'For images from Media Library only.',
							'getwid'
						) }
						value={ imageSize }
						onChange={ onChangeImageSize }
						options={ imageSizeOptions }
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
