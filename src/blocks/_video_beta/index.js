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

const ALLOWED_MEDIA_TYPES = [ 'video' ];
const IMAGE_BACKGROUND_TYPE = 'image';
const VIDEO_BACKGROUND_TYPE = 'video';

/**
 * Register static block example block
 */
export default registerBlockType(
	'getwid/video',
	{
		title: __('Video', 'getwid'),
		category: 'getwid-blocks',
		icon: 'format-video',
		keywords: [
			__('getwid', 'getwid'),
		],
		attributes,

		getEditWrapperProps( attributes ) {
			const { align } = attributes;
			if ( -1 !== validAlignments.indexOf( align ) ) {
				return { 'data-align': align };
			}
		},

		edit: Edit,

		save( { attributes } ) {
			const {
				id,
				url,
				link,
				newWindow,
				align,
				textColor,
				overlayColor,
				backgroundOpacity,
			} = attributes;

			const className = 'wp-block-getwid-banner';

			const wrapperStyle = {
				color: textColor,
			};

			const imageStyle = {
				backgroundColor: overlayColor,
			};

			const captionStyle = {
				minHeight: minHeight,
			};

			const wrapperClasses = classnames(
				className,
				`${className}--${blockAnimation}`,
				{
					[ `${className}--${textAnimation}` ]: textAnimation != 'none',
					[ `${className}--foreground-${backgroundOpacity}` ]: backgroundOpacity != 35,
					[ `${className}--vertical-${verticalAlign}` ]: verticalAlign != 'center',
					[ `${className}--horizontal-${horizontalAlign}` ]: horizontalAlign != 'center',
				},
				align ? `align${ align }` : null,
			);

			return (
				<div className={ wrapperClasses } style={ wrapperStyle }>
					<a href={typeof link != 'undefined' ? link : '#'} target={newWindow ? '_blank' : null} class={`${className}__link`}>

						{ !! url && (
							<figure
								className= {`${className}__wrapper`}
								style= {imageStyle}
							>
								{ (VIDEO_BACKGROUND_TYPE === type && !!url ) ? (
									<video
										className= {`${className}__video`}
										autoPlay
										muted
										loop
										src={ url }
									/>
								) : (<img src={ url } alt="" className={ `${className}__image ` + (id ? `wp-image-${ id }` : null) }/>) }

								<Fragment>
									<figcaption
										className= {`${className}__caption`}
										style= {captionStyle}
									>
										<div className= {`${className}__caption-wrapper`}>
											{ ! RichText.isEmpty( title ) && (
												<RichText.Content tagName="span" className= {`${className}__title`} value={ title } />
											) }

											{ ! RichText.isEmpty( text ) && (
												<RichText.Content tagName="p" className= {`${className}__text`} value={ text } />
											) }
										</div>
									</figcaption>
								</Fragment>
							</figure>
						) }	
					</a>				
				</div>
			);
		},

	},
);