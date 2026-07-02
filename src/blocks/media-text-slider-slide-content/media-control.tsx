import { MediaUpload } from '@wordpress/block-editor';
import { BaseControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { MediaObject } from './types';

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
			<MediaUpload
				onSelect={ onSelectMedia }
				allowedTypes={ allowedMediaTypes }
				value={ id }
				render={ ( { open }: { open: () => void } ) => (
					<BaseControl __nextHasNoMarginBottom>
						{ url && (
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
						) }
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
					</BaseControl>
				) }
			/>
		</BaseControl>
	);
}
