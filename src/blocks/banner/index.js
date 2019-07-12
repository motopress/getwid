/**
* Internal dependencies
*/
import Edit from './edit';
import attributes from './attributes';

import './style.scss'

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';

const { Fragment } = wp.element;
const { registerBlockType, createBlock } = wp.blocks;
const { RichText, getColorClassName } = wp.editor;

/**
* Module Constants
*/
const validAlignments = [ 'left', 'center', 'right', 'wide', 'full' ];
const VIDEO_BACKGROUND_TYPE = 'video';
const baseClass = 'wp-block-getwid-banner';

/**
* Register the block
*/
export default registerBlockType(
	'getwid/banner',
	{
		title: __( 'Banner', 'getwid' ),
		description: __( 'Link an image or video with a text overlay.', 'getwid' ),
		category: 'getwid-blocks',
		icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><rect x="14" y="5" width="6" height="2"/><rect x="14" y="9" width="6" height="2"/><polygon points="8,4 9.1,5.2 10.8,5.2 10.8,6.9 12,8 10.8,9.1 10.8,10.8 9.1,10.8 8,12 6.9,10.8 5.2,10.8 5.2,9.1 4,8 5.2,6.9 5.2,5.2 6.9,5.2 "/><polygon points="17.6,15 10.3,12.6 11.9,20.1 13.8,18.4 17,21.9 18.9,20.2 15.7,16.7"/><g><polygon points="0,0 0,16 9,16 8.6,14 2,14 2,2 22,2 22,14 19.3,14 19.7,16 24,16 24,0"/></g></svg>,

		keywords: [
			__( 'image', 'getwid' ),
			__( 'cover', 'getwid' )
		],	
		transforms: {
			from: [
				{
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ( attributes ) => createBlock( 'getwid/banner', {
						id: attributes.id,
						url: attributes.url,
						title: attributes.caption							
					} )
				}
			],
			to: [
				{
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ( attributes ) => createBlock( 'core/image', {
						id: attributes.id,
						url: attributes.url,
						caption: attributes.title ? attributes.title : (attributes.text ? attributes.text : ''),
					} )
				},
				{
					type: 'block',
					blocks: [ 'core/heading' ],
					transform: ( attributes ) => createBlock( 'core/heading', {
						content: attributes.title,
					} )
				},
				{
					type: 'block',
					blocks: [ 'core/paragraph' ],
					transform: ( attributes ) => createBlock( 'core/paragraph', {
						content: attributes.text,
					} )
				},			
			],
		},
		attributes,
		getEditWrapperProps( attributes ) {
			const { align } = attributes;
			if ( -1 !== validAlignments.indexOf( align ) ) {
				return { 'data-align': align };
			}
		},
		edit: Edit,
		save: props => {
			const {
				attributes: {
					videoAutoplay,
					id,
					url,
					type,
					title,
					text,
					link,
					align,
					minHeight,
					contentMaxWidth,
					verticalAlign,
					horizontalAlign,

                    rel,
                    linkTarget,

					backgroundColor,
					textColor,
					customBackgroundColor,
					customTextColor,

					backgroundOpacity,
					blockAnimation,
					textAnimation,
					
					className
				}
			} = props;

			const textClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );

			const imageProps = {
				className: classnames(
					`${baseClass}__wrapper`,
					{				
						'has-background': (backgroundColor || customBackgroundColor),
						[ backgroundClass ]: (backgroundClass),		
					}
				),
				style: {
					backgroundColor: (props.attributes.backgroundColor ? undefined : props.attributes.customBackgroundColor),
				},
			};

			const captionProps = {
				className: classnames(
					`${baseClass}__caption`,
					{
						'has-text-color': textColor || customTextColor,
						[ textClass ]: textClass,
					},
				),
				style: {
					color: (typeof textColor != 'undefined' ? undefined : customTextColor),
					minHeight: minHeight,
				},
			};

			const wrapperProps = {
				className: classnames(
					className,
					`has-animation-${blockAnimation}`,
					{
						[ `has-text-animation-${textAnimation}` ]: textAnimation != 'none',
						[ `has-foreground-${backgroundOpacity}` ]: backgroundOpacity != 35,
						[ `has-vertical-alignment-${verticalAlign}` ]: verticalAlign != 'center',
						[ `has-horizontal-alignment-${horizontalAlign}` ]: horizontalAlign != 'center',
					},
					align ? `align${ align }` : null,
				),
			};

			return (
				<div {...wrapperProps}>
					<a href={typeof link != 'undefined' ? link : '#'} target={ linkTarget } rel={ rel } className={`${baseClass}__link`}>

						{ !! url && (
							<div {...imageProps}>
								{ (VIDEO_BACKGROUND_TYPE === type && !!url ) ? (
									<video
										className= {`${baseClass}__video ${baseClass}__source`}
										autoPlay={videoAutoplay}
										muted
										loop
										src={ url }
									/>
								) : (<img src={ url } alt="" className={ `${baseClass}__image ${baseClass}__source ` + (id ? `wp-image-${ id }` : null) }/>) }

								<Fragment>
									<div {...captionProps}>
										<div style={{maxWidth: contentMaxWidth}} className= {`${baseClass}__caption-wrapper`}>
											{ ! RichText.isEmpty( title ) && (
												<RichText.Content tagName="span" className= {`${baseClass}__title`} value={ title } />
											) }

											{ ! RichText.isEmpty( text ) && (
												<RichText.Content tagName="p" className= {`${baseClass}__text`} value={ text } />
											) }
										</div>
									</div>
								</Fragment>
							</div>
						) }	
					</a>				
				</div>
			);
		}
	}
);