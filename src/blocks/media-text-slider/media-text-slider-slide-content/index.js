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
			
			return (
				<div className={ className }>
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