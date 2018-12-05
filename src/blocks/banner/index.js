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

const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];
const IMAGE_BACKGROUND_TYPE = 'image';
const VIDEO_BACKGROUND_TYPE = 'video';

function backgroundImageStyles( backgroundUrl ) {
	return backgroundUrl ?
		{ backgroundImage: `url(${ backgroundUrl })` } :
		{};
}

/**
 * Register static block example block
 */
export default registerBlockType(
	'getwid/banner',
	{
		title: __('Getwid Banner', 'getwid'),
		description: __('Getwid Banner', 'getwid'),
		category: 'common',
		icon: {
			foreground: '#bf3737',
			src: 'format-image',
		},	

		keywords: [
			__('Getwid', 'getwid'),
			__('Banner', 'getwid'),
		],
/*		supports: {
			alignWide: true,
			align: [ 'wide', 'full' ],
		},*/
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
				backgroundId,
				backgroundUrl,
				backgroundType,
				title,
				text,
				link,
				align,
				minHeight,
				verticalAlign,
				horizontalAlign,
				textColor,
				overlayColor,
				backgroundOpacity,
				blockAnimation,
				textAnimation,
			} = attributes;
			// const overlayColorClass = getColorClassName( 'background-color', overlayColor );
			const style = backgroundType === IMAGE_BACKGROUND_TYPE ?
				backgroundImageStyles( backgroundUrl ) :
				{};
		/*	if ( ! overlayColorClass ) {
				style.backgroundColor = customOverlayColor;
			}*/

			const classes = classnames(
				// overlayColorClass,
				// [ `has-${ contentAlign }-content` ]: contentAlign !== 'center',
				{
					'has-parallax': true,
				},
				align ? `align${ align }` : null,
			);

			return (
				<div className={ classes } style={ style }>
					{ VIDEO_BACKGROUND_TYPE === backgroundType && backgroundUrl && ( <video
						className="wp-block-cover__video-background"
						autoPlay
						muted
						loop
						src={ backgroundUrl }
					/> ) }
					{ ! RichText.isEmpty( title ) && (
						<RichText.Content tagName="p" className="wp-block-cover-text" value={ title } />
					) }
				</div>
			);
		},

	},
);