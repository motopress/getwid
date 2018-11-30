/**
 * Block dependencies
 */
import edit from './edit';
import attributes from './attributes';

import './style.scss';
import { noop } from 'lodash';
import classnames from "classnames";

const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const {
	BlockControls,
	AlignmentToolbar,
	InnerBlocks,
	getColorClassName
} = wp.editor;

const {
	Toolbar
} = wp.components;

const { Fragment } = wp.element;
const DEFAULT_MEDIA_WIDTH = 50;

/**
 * Register static block example block
 */
export default registerBlockType(
	'getwid/media-text-slider-slide-content',
	{
		title: __('Getwid Slide-content', 'getwid'),
		description: __('@todo description', 'getwid'),
		category: 'common',
		parent: [ 'getwid/media-text-slider-slide' ],
		icon: {	
			src: 'format-image',
		},	
		supports: {
			html: false,
		},
		attributes,

		edit,

		save( { attributes } ) {
			const {
				backgroundColor,
				customBackgroundColor,
				mediaAlt,
				mediaType,
				mediaUrl,
				mediaWidth,
				mediaId,
			} = attributes;

			const className = 'wp-block-getwid-media-text-slider-slide-content'

			const mediaTypeRenders = {
				image: () => <img src={ mediaUrl } alt={ mediaAlt } className={ ( mediaId && mediaType === 'image' ) ? `wp-image-${ mediaId }` : null } />,
				video: () => <video controls src={ mediaUrl } />,
			};
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );
/*			const className = classnames( {
				[ backgroundClass ]: backgroundClass,
			} );*/

			const style = {
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
			};
			return (
				<div className={ className } style={ style }>
					<figure className={`${className}__media`} >
						{ ( mediaTypeRenders[ mediaType ] || noop )() }
						<div className={`${className}__media-overlay`}></div>				
					</figure>
					<div className={`${className}__content`}>
						<div className={`${className}__content-wrapper`}>
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			);
		},

	},
);