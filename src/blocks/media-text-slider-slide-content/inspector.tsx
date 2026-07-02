import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import MediaControl from './media-control';
import type {
	MediaObject,
	MediaTextSliderSlideContentEditProps,
} from './types';

type InspectorProps = MediaTextSliderSlideContentEditProps & {
	onSelectMedia: ( media: MediaObject ) => void;
};

export default function Inspector( {
	attributes,
	setAttributes,
	clientId,
	onSelectMedia,
}: InspectorProps ) {
	const block = useSelect(
		( select ) => select( 'core/block-editor' ).getBlock( clientId ),
		[ clientId ]
	);
	const { mediaId, mediaUrl } = attributes;

	if ( ! block ) {
		return <InspectorControls />;
	}

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Image', 'getwid' ) } initialOpen>
				<MediaControl
					label={ __( 'Image', 'getwid' ) }
					url={ mediaUrl }
					id={ mediaId }
					onSelectMedia={ onSelectMedia }
					onRemoveMedia={ () =>
						setAttributes( {
							mediaUrl: undefined,
							mediaId: undefined,
						} )
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
