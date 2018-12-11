/**
 * Block dependencies
 */
import { default as edit, defaultColumnsNumber, pickRelevantMediaFiles } from './edit';
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
	'getwid/images-slider',
	{
		title: __('Getwid Images slider', 'getwid'),
		description: __('@todo description', 'getwid'),
		category: 'common',
		icon: {	
			foreground: '#bf3737',
			src: 'format-gallery',
		},		
		supports: {
			html: false,
		},
		attributes,

		edit,

		save( { attributes } ) {
			const { images, columns = defaultColumnsNumber( attributes ), imageCrop, linkTo } = attributes;
			return (
				<ul className={ `columns-${ columns } ${ imageCrop ? 'is-cropped' : '' }` } >
					{ images.map( ( image ) => {
						let href;

						switch ( linkTo ) {
							case 'media':
								href = image.url;
								break;
							case 'attachment':
								href = image.link;
								break;
						}

						const img = <img src={ image.url } alt={ image.alt } data-id={ image.id } data-link={ image.link } className={ image.id ? `wp-image-${ image.id }` : null } />;

						return (
							<li key={ image.id || image.url } className="blocks-gallery-item">
								<figure>
									{ href ? <a href={ href }>{ img }</a> : img }
									{ image.caption && image.caption.length > 0 && (
										<RichText.Content tagName="figcaption" value={ image.caption } />
									) }
								</figure>
							</li>
						);
					} ) }
				</ul>
			);
		},

	},
);