import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { MediaControl } from 'getwid-components';

import type { TestimonialEditProps, TestimonialMedia } from './types';

type InspectorProps = TestimonialEditProps & {
	onSelectMedia: ( media: TestimonialMedia ) => void;
};

export default function Inspector( {
	attributes: { imgId, imgUrl },
	setAttributes,
	onSelectMedia,
}: InspectorProps ) {
	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<MediaControl
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
			</PanelBody>
		</InspectorControls>
	);
}
