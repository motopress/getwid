/**
 * Block dependencies
 */
import Edit from './edit';
import attributes from './attributes';

import './style.scss'
import classnames from "classnames";

const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const {
	BlockControls,
	InspectorControls,
	BlockAlignmentToolbar,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	AlignmentToolbar,
	PanelColorSettings,
	RichText,
	withColors,
	getColorClassName,
	getColorObjectByAttributeValues
} = wp.editor;

const {
	IconButton,
	PanelBody,
	RangeControl,
	ToggleControl,
	Toolbar,
	withNotices,
	SVG,
	Path,
} = wp.components;

const { Fragment } = wp.element;

const validAlignments = [ 'left', 'center', 'right', 'wide', 'full' ];

const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];
const IMAGE_BACKGROUND_TYPE = 'image';
const VIDEO_BACKGROUND_TYPE = 'video';

/**
 * Register static block example block
 */
export default registerBlockType(
	'getwid/banner',
	{
		title: __('Banner', 'getwid'),
		category: 'getwid-blocks',
		icon: <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><Path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5zM20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2zm0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z" /><Path d="M0 0h24v24H0z" fill="none" /></SVG>,

		keywords: [
			__('image', 'getwid'),
			__('cover', 'getwid')
		],
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
					id,
					url,
					type,
					title,
					text,
					link,
					newWindow,
					align,
					minHeight,
					contentMaxWidth,
					verticalAlign,
					horizontalAlign,

					backgroundColor,
					textColor,
					customBackgroundColor,
					customTextColor,

					backgroundOpacity,
					blockAnimation,
					textAnimation,					
				}
			} = props;

			const className = 'wp-block-getwid-banner';

			const textClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );

/*			const wrapperStyle = {
				color: (typeof textColor != 'undefined' ? undefined : customTextColor),
			};

			const imageStyle = {
				backgroundColor: (props.attributes.backgroundColor ? undefined : props.attributes.customBackgroundColor),
			};*/

			/*const captionStyle = {
				minHeight: minHeight,
			};*/

/*			const wrapperClasses = classnames(
				className,
				`${className}--${blockAnimation}`,
				{
					[ `${className}--${textAnimation}` ]: textAnimation != 'none',
					[ `${className}--foreground-${backgroundOpacity}` ]: backgroundOpacity != 35,
					[ `${className}--vertical-${verticalAlign}` ]: verticalAlign != 'center',
					[ `${className}--horizontal-${horizontalAlign}` ]: horizontalAlign != 'center',
				},
				align ? `align${ align }` : null,
			);*/

			const imageProps = {
				className: classnames(
					`${className}__wrapper`,
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
					`${className}__caption`,
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
					`${className}--${blockAnimation}`,
					{
						[ `${className}--${textAnimation}` ]: textAnimation != 'none',
						[ `${className}--foreground-${backgroundOpacity}` ]: backgroundOpacity != 35,
						[ `${className}--vertical-${verticalAlign}` ]: verticalAlign != 'center',
						[ `${className}--horizontal-${horizontalAlign}` ]: horizontalAlign != 'center',
					},
					align ? `align${ align }` : null,
				),
			};

			return (
				<div {...wrapperProps}>
					<a href={typeof link != 'undefined' ? link : '#'} target={newWindow ? '_blank' : null} class={`${className}__link`}>

						{ !! url && (
							<div {...imageProps}>
								{ (VIDEO_BACKGROUND_TYPE === type && !!url ) ? (
									<video
										className= {`${className}__video ${className}__source`}
										autoPlay
										muted
										loop
										src={ url }
									/>
								) : (<img src={ url } alt="" className={ `${className}__image ${className}__source ` + (id ? `wp-image-${ id }` : null) }/>) }

								<Fragment>
									<div {...captionProps}>
										<div style={{maxWidth: contentMaxWidth}} className= {`${className}__caption-wrapper`}>
											{ ! RichText.isEmpty( title ) && (
												<RichText.Content tagName="span" className= {`${className}__title`} value={ title } />
											) }

											{ ! RichText.isEmpty( text ) && (
												<RichText.Content tagName="p" className= {`${className}__text`} value={ text } />
											) }
										</div>
									</div>
								</Fragment>
							</div>
						) }	
					</a>				
				</div>
			);
		},

	},
);