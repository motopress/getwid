import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import type { MediaTextSliderSlideContentAttributes } from './types';

import './style.scss';

const baseClass = 'wp-block-getwid-media-text-slider-slide-content';

type SaveProps = {
	attributes: MediaTextSliderSlideContentAttributes;
	className?: string;
};

function renderMedia( {
	mediaAlt,
	mediaId,
	mediaType,
	mediaUrl,
}: MediaTextSliderSlideContentAttributes ) {
	if ( mediaType === 'image' ) {
		return (
			<img
				src={ mediaUrl }
				alt={ mediaAlt }
				className={
					`${ baseClass }__image` +
					( mediaId ? ` wp-image-${ mediaId }` : '' )
				}
			/>
		);
	}

	if ( mediaType === 'video' ) {
		return <video controls src={ mediaUrl } />;
	}

	return null;
}

export default function Save( { attributes, className }: SaveProps ) {
	const { innerParent } = attributes;
	const blockProps = useBlockProps.save( {
		style: {
			maxWidth: innerParent?.attributes.contentMaxWidth,
		},
		className,
	} );
	const overlayStyle = {
		backgroundColor: innerParent?.attributes.overlayColor,
		opacity:
			innerParent?.attributes.overlayOpacity !== undefined
				? innerParent.attributes.overlayOpacity / 100
				: undefined,
	};

	return (
		<div { ...blockProps }>
			<figure className={ `${ baseClass }__media` }>
				{ renderMedia( attributes ) }
				<div
					className={ `${ baseClass }__media-overlay` }
					style={ overlayStyle }
				/>
			</figure>
			<div
				className={ `${ baseClass }__content` }
				style={ { color: innerParent?.attributes.textColor } }
			>
				<div className={ `${ baseClass }__content-wrapper` }>
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
}
