import { MediaPlaceholder, MediaUpload } from '@wordpress/block-editor';
import { BaseControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import './editor.scss';

const allowedMediaTypes = [ 'image' ];

type MediaControlProps< T > = {
	id?: number;
	url?: string;
	label: string;
	removeButton?: boolean;
	onSelectMedia: ( media: T ) => void;
	onRemoveMedia: () => void;
};

export default function MediaControl< T >( {
	id,
	url,
	label,
	removeButton = true,
	onSelectMedia,
	onRemoveMedia,
}: MediaControlProps< T > ) {
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
							<div className="components-getwid-media-control__actions">
								<Button variant="primary" onClick={ open }>
									{ id
										? __( 'Replace Image', 'getwid' )
										: __( 'Select Image', 'getwid' ) }
								</Button>
								{ removeButton && (
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
