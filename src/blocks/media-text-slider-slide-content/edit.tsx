import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useContext, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import { MediaTextSliderContext } from '../media-text-slider/edit';
import Inspector from './inspector';
import MediaContainer from './media-container';
import type {
	MediaObject,
	MediaTextSliderSlideContentEditProps,
} from './types';

import './editor.scss';

const baseClass = 'wp-block-getwid-media-text-slider-slide-content';
const template = [
	[ 'core/heading', { placeholder: __( 'Write heading…', 'getwid' ) } ],
	[ 'core/paragraph', { placeholder: __( 'Write text…', 'getwid' ) } ],
];

function getMediaUrl(
	media: MediaObject,
	size: string,
	fallbackSize = 'large'
) {
	return (
		media.media_details?.sizes?.[ size ]?.source_url ||
		media.media_details?.sizes?.[ fallbackSize ]?.source_url ||
		media.media_details?.sizes?.full?.source_url ||
		media.sizes?.[ size ]?.url ||
		media.url ||
		media.source_url
	);
}

export default function Edit( props: MediaTextSliderSlideContentEditProps ) {
	const { attributes, setAttributes, clientId, isSelected } = props;
	const { mediaAlt, mediaId, mediaType, mediaUrl, innerParent } = attributes;
	const { updateContentAttributes } = useContext( MediaTextSliderContext );
	const imgObj = useSelect(
		( select ) =>
			mediaId
				? ( select( 'core' ).getMedia( mediaId ) as MediaObject )
				: null,
		[ mediaId ]
	);
	const blockProps = useBlockProps( {
		className: clsx( { 'is-selected': isSelected } ),
	} );

	function onSelectMedia( media: MediaObject ) {
		if ( ! media ) {
			return;
		}

		const nextMediaType =
			media.media_type !== undefined && media.media_type
				? media.media_type === 'image'
					? 'image'
					: 'video'
				: media.type === 'video'
				? 'video'
				: 'image';
		const size = innerParent?.attributes.imageSize ?? 'full';

		setAttributes( {
			mediaAlt: media.alt,
			mediaId: media.id,
			mediaUrl:
				nextMediaType === 'image'
					? getMediaUrl( media, size )
					: media.url || media.source_url,
			mediaType: nextMediaType,
		} );
	}

	useEffect( () => {
		if ( ! innerParent ) {
			updateContentAttributes( clientId );
		}
	}, [ clientId, innerParent, updateContentAttributes ] );

	useEffect( () => {
		if ( imgObj && innerParent?.attributes.imageSize ) {
			onSelectMedia( imgObj );
		}
	}, [ innerParent?.attributes.imageSize ] );

	return (
		<>
			<Inspector { ...props } onSelectMedia={ onSelectMedia } />
			<div { ...blockProps }>
				<MediaContainer
					className={ `${ baseClass }__media` }
					onSelectMedia={ onSelectMedia }
					mediaAlt={ mediaAlt }
					mediaId={ mediaId }
					mediaType={ mediaType }
					mediaUrl={ mediaUrl }
					innerParent={ innerParent }
				/>
				<div
					className={ `${ baseClass }__content` }
					style={ { color: innerParent?.attributes.textColor } }
				>
					<div className={ `${ baseClass }__content-wrapper` }>
						{ mediaUrl && (
							<InnerBlocks
								templateLock={ false }
								template={ template }
								templateInsertUpdatesSelection={ false }
							/>
						) }
					</div>
				</div>
			</div>
		</>
	);
}
