/**
 * Block dependencies
 */
import { default as edit } from './edit';
import attributes from './attributes';

import './style.scss';
import {
	noop,
	chunk
} from 'lodash';
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
		title: __('Image Stack Gallery', 'getwid'),
		category: 'getwid-blocks',
		icon: {	
			src: 'admin-page',
		},
		keywords: [
			__('Getwid', 'getwid')
		],	
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
					images,
					ids,
					linkTo,
					imageSize,
					stackStyle,
					stackOverlap
				},
			} = props;

			const className = 'wp-block-getwid-images-stack';

			const containerClasses = classnames(
				className,
				`${className}`,
				{
					[ `is-style-${stackStyle}` ]: stackStyle != 'default',
				},
				align ? `align${ align }` : null,
			);

			const arr_chunks = chunk(images, 3);

			return (
				<div className={ containerClasses }>
					<div className={`${className}__wrapper`}>
						{ arr_chunks.map((chunk, index) => {

							return (
								<div className={`${className}__chunk`}>
									{ chunk.map( ( image ) => {
										let href;

										switch ( linkTo ) {
											case 'media':
												href = image.original_url;
												break;
											case 'attachment':
												href = image.link;
												break;
										}

										const imageClasses = classnames(
                                            `${className}__media`,
                                            image.id ? `wp-image-${ image.id }` : null
										);
 										const img = <img className={imageClasses} src={ image.url } alt={ image.alt } data-id={ image.id } data-link={ image.link }/>;

										return (
											<div key={ image.id || image.url } className={`${className}__media-wrapper`}>
                                                <div className="wp-block-getwid-images-stack__media-inner-wrapper">
													<Fragment>
														{ href ? <a href={ href }>{ img }</a> : img }
													</Fragment>
												</div>
											</div>
										);

									} ) }
								</div>
							);

						} ) }
					</div>
				</div>
			);
		},

	},
);