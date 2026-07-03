import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type {
	ContentTimelineItemEditProps,
	MediaObject,
} from '../content-timeline/types';
import { ImageSizeSelect, MediaControl } from 'getwid-components';

type InspectorProps = ContentTimelineItemEditProps & {
	imgObj: MediaObject | null;
	onSelectImage: ( image: MediaObject ) => void;
	onChangeImageSize: ( imageSize: string ) => void;
};

export default function Inspector( {
	attributes,
	setAttributes,
	imgObj,
	onSelectImage,
	onChangeImageSize,
}: InspectorProps ) {
	const { id, url, cardPosition, imageSize } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
				<SelectControl
					label={ __( 'Block Alignment', 'getwid' ) }
					value={ cardPosition }
					onChange={ ( nextCardPosition ) =>
						setAttributes( { cardPosition: nextCardPosition } )
					}
					options={ [
						{ value: '', label: __( 'Auto', 'getwid' ) },
						{ value: 'left', label: __( 'Left', 'getwid' ) },
						{ value: 'right', label: __( 'Right', 'getwid' ) },
					] }
				/>
				<MediaControl
					label={ __( 'Image', 'getwid' ) }
					url={ url }
					id={ id }
					onSelectMedia={ onSelectImage }
					onRemoveMedia={ () =>
						setAttributes( {
							url: undefined,
							id: undefined,
						} )
					}
				/>
				{ url && imgObj && (
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
			</PanelBody>
		</InspectorControls>
	);
}
