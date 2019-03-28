/**
* External dependencies
*/
import { default as edit } from './edit';
import attributes from './attributes';
import classnames from "classnames";
import './style.scss';
import {
	chunk
} from 'lodash';


/**
* WordPress dependencies
*/
const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const { Fragment } = wp.element;


/**
* Module Constants
*/
const validAlignments = [ 'center', 'wide', 'full' ];


/**
* Register the block
*/
export default registerBlockType(
	'getwid/images-stack',
	{
		title: __('Image Stack Gallery', 'getwid'),
		category: 'getwid-blocks',
		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14,10h8V2H14Zm6-6V8H16V4Z"/><path d="M12,12V0H0V18H7v6H24V12ZM2,16V2h8V16H2Zm20,6H9V18h3V14H22Z"/></svg>,
		keywords: [
			__('photo', 'getwid')
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