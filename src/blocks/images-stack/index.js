/**
 * Block dependencies
 */
import { default as edit } from './edit';
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

const validAlignments = [ 'center', 'wide', 'full' ];

/**
 * Register static block example block
 */
export default registerBlockType(
	'getwid/images-stack',
	{
		title: __('Getwid Images stack gallery', 'getwid'),
		description: __('@todo description', 'getwid'),
		category: 'common',
		icon: {	
			foreground: '#bf3737',
			src: 'admin-page',
		},		
		supports: {
			html: false,
		},
		attributes,

		getEditWrapperProps( attributes ) {
			const { align } = attributes;
			if ( -1 !== validAlignments.indexOf( align ) ) {
				return { 'data-align': align };
			}
		},

		edit,

		save( props ) {
			const {
				attributes:{
					align,
					imgObj,
					images,
					ids,
					linkTo,
					imageSize,
					stackStyle,
				},
			} = props;

			const className = 'wp-block-getwid-images-stack';

			const containerClasses = classnames(
				className,
				`${className}`,
				{
					[ `${className}--${stackStyle}` ]: stackStyle != 'default',
				},
				align ? `align${ align }` : null,
			);

			return (
				<div className={ containerClasses }>
					<div className={`${className}__wrapper`}>
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

							const img = <img className={`${className}__media`} src={ image.url } alt={ image.alt } data-id={ image.id } data-link={ image.link } className={ image.id ? `wp-image-${ image.id }` : null } />;

							return (
								<div key={ image.id || image.url } className={`${className}__media-wrapper`}>
									<Fragment>
										{ href ? <a href={ href }>{ img }</a> : img }
									</Fragment>
								</div>
							);
						} ) }
					</div>
				</div>
			);
		},

	},
);