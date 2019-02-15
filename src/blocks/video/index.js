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

const validAlignments = [ 'wide', 'full' ];

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
				playOnScroll,
				minHeight,
				overlayColor,
				backgroundOpacity,
			} = attributes;

			const videoData = {
				'data-play' : playOnScroll,
			};

			const className = 'wp-block-getwid-video';

			const imageStyle = {
				minHeight: minHeight,
				backgroundColor: overlayColor,
			};

			const wrapperClasses = classnames(
				className,
				{
					[ `${className}--foreground-${backgroundOpacity}` ]: backgroundOpacity != 35,
				},
				align ? `align${ align }` : null,
			);

			return (
				<div className={ wrapperClasses }>
					<a href={typeof link != 'undefined' ? link : '#'} target={newWindow ? '_blank' : null} class={`${className}__link`}>

						{ !! url && (
							<div
								className = {`${className}__wrapper`}
								style = {imageStyle}
							>
								{ (!!url ) ? (
									<video
										className = {`${className}__video`}
										autoPlay
										muted
										loop
										src ={ url }
									/>
								) : null }
							</div>
						) }	
					</a>				
				</div>
			);
		},

	},
);