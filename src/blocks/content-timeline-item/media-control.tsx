import { MediaPlaceholder, MediaUpload } from '@wordpress/block-editor';
import { BaseControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { MediaObject } from '../content-timeline/types';

const allowedMediaTypes = [ 'image' ];

type MediaControlProps = {
	id?: number;
	url?: string;
	label: string;
	onSelectMedia: ( media: MediaObject ) => void;
	onRemoveMedia: () => void;
};

export default function MediaControl( {
	id,
	url,
	label,
	onSelectMedia,
	onRemoveMedia,
}: MediaControlProps ) {
	return (
		<BaseControl label={ label } __nextHasNoMarginBottom>
			{ ! url && (
				<MediaPlaceholder
					icon="format-image"
					labels={ {
						title: __( 'Image', 'getwid' ),
						instructions: __(
							'Upload an image file, pick one from your media library, or add one with a URL.',
							'getwid'
						),
					} }
					onSelect={ onSelectMedia }
					accept="image/*"
					allowedTypes={ allowedMediaTypes }
				/>
			) }
			{ url && (
				<MediaUpload
					onSelect={ onSelectMedia }
					allowedTypes={ allowedMediaTypes }
					value={ id }
					render={ ( { open }: { open: () => void } ) => (
						<BaseControl __nextHasNoMarginBottom>
							<div
								onClick={ open }
								onKeyDown={ ( event ) => {
									if (
										event.key === 'Enter' ||
										event.key === ' '
									) {
										open();
									}
								} }
								className="getwid-background-image-wrapper"
								role="button"
								tabIndex={ 0 }
							>
								<img src={ url } alt="" />
							</div>
							<div>
								<Button variant="primary" onClick={ open }>
									{ id
										? __( 'Replace Image', 'getwid' )
										: __( 'Select Image', 'getwid' ) }
								</Button>
								{ id && (
									<Button
										variant="secondary"
										onClick={ onRemoveMedia }
									>
										{ __( 'Remove Image', 'getwid' ) }
									</Button>
								) }
							</div>
						</BaseControl>
					) }
				/>
			) }
		</BaseControl>
	);
}
