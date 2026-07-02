import {
	BlockControls,
	MediaPlaceholder,
	MediaUpload,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type {
	MediaObject,
	MediaTextSliderSlideContentAttributes,
} from './types';

const allowedMediaTypes = [ 'image' ];
const baseClass = 'wp-block-getwid-media-text-slider-slide-content';

type MediaContainerProps = Pick<
	MediaTextSliderSlideContentAttributes,
	'mediaAlt' | 'mediaId' | 'mediaType' | 'mediaUrl' | 'innerParent'
> & {
	className: string;
	onSelectMedia: ( media: MediaObject ) => void;
};

export default function MediaContainer( {
	mediaAlt,
	mediaId,
	mediaType,
	mediaUrl,
	innerParent,
	className,
	onSelectMedia,
}: MediaContainerProps ) {
	const overlayStyle = {
		backgroundColor: innerParent?.attributes.overlayColor,
		opacity:
			innerParent?.attributes.overlayOpacity !== undefined
				? innerParent.attributes.overlayOpacity / 100
				: undefined,
	};
	const toolbar = (
		<BlockControls>
			<ToolbarGroup>
				<MediaUpload
					onSelect={ onSelectMedia }
					allowedTypes={ allowedMediaTypes }
					value={ mediaId }
					render={ ( { open }: { open: () => void } ) => (
						<ToolbarButton
							label={ __( 'Edit Media', 'getwid' ) }
							icon="edit"
							onClick={ open }
						/>
					) }
				/>
			</ToolbarGroup>
		</BlockControls>
	);

	if ( mediaType && mediaUrl ) {
		if ( mediaType === 'image' ) {
			return (
				<>
					{ toolbar }
					<figure className={ className }>
						<img
							className={ `${ baseClass }__image` }
							src={ mediaUrl }
							alt={ mediaAlt }
						/>
						<div
							style={ overlayStyle }
							className={ `${ className }-overlay` }
						/>
					</figure>
				</>
			);
		}

		return (
			<>
				{ toolbar }
				<figure className={ className }>
					<video controls src={ mediaUrl } />
				</figure>
			</>
		);
	}

	return (
		<MediaPlaceholder
			icon="format-image"
			labels={ {
				title: __( 'Image', 'getwid' ),
			} }
			accept="image/*"
			className={ className }
			onSelect={ onSelectMedia }
			allowedTypes={ allowedMediaTypes }
		/>
	);
}
