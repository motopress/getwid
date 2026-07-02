import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import MediaControl from './media-control';
import type {
	ContentTimelineItemEditProps,
	ImageSizeOption,
	MediaObject,
} from '../content-timeline/types';

type InspectorProps = ContentTimelineItemEditProps & {
	imgObj: MediaObject | null;
	onSelectImage: ( image: MediaObject ) => void;
	onChangeImageSize: ( imageSize: string ) => void;
};

type GetwidGlobal = {
	settings: {
		image_sizes: ImageSizeOption[];
	};
};

const getwid = ( window as Window & { Getwid: GetwidGlobal } ).Getwid;

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
					__nextHasNoMarginBottom
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
					<SelectControl
						label={ __( 'Image Size', 'getwid' ) }
						help={ __(
							'For images from Media Library only.',
							'getwid'
						) }
						value={ imageSize }
						onChange={ onChangeImageSize }
						options={ getwid.settings.image_sizes }
						__nextHasNoMarginBottom
					/>
				) }
			</PanelBody>
		</InspectorControls>
	);
}
