/**
 * External dependencies
 */
import classnames from 'classnames';
import attributes from './attributes';
import Inspector from './inspector';
import './editor.scss'
import './style.scss'
import {
	get
} from "lodash";


/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const {
	BlockControls,
	BlockAlignmentToolbar,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInput,
	withColors,
} = wp.blockEditor || wp.editor;
const {compose} = wp.compose;
const {
	withSelect
} = wp.data;
const {
	ToolbarButton,
	ToolbarGroup,
	Dashicon,
	TextControl
} = wp.components;
const {Component, Fragment} = wp.element;


/**
 * Module Constants
 */
const alignmentsList = ['wide', 'full'];
const ALLOWED_MEDIA_TYPES = ['image'];
const IMAGE_BACKGROUND_TYPE = 'image';
const baseClass = 'wp-block-getwid-video-popup';

const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color'
];

/**
 * Create an Component
 */
class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	initPopUp() {
		const {
			clientId
		} = this.props;

		const thisBlock = $(`[data-block='${clientId}']`);
		const videoWrapper = $('.wp-block-getwid-video-popup__link', thisBlock);
		videoWrapper.on('click', function (e) {
			e.preventDefault();
		});
	}

	componentDidMount() {
		this.initPopUp();
	}

	componentDidUpdate(prevProps) {
		this.initPopUp();
	}

	render() {
		const {
			attributes: {
				id,
				url,
				title,
				link,
				align,
				minHeight,
				buttonMaxWidth,
				buttonStyle,
				buttonAnimation,
				buttonSize,
				overlayOpacity,
				imageAnimation,

				customTitleColor,
				customIconColor,
				customButtonColor,
				customOverlayColor,
			},
			titleColor,
			iconColor,
			buttonColor,
			overlayColor,
			setAttributes,
			isSelected,
			className,
		} = this.props;

		const changeImageSize = (media, imageSize) => {
			if (!media) {
				setAttributes({url: undefined, id: undefined});
				return;
			}

			let mediaType;
			if (media.media_type) {
				if (media.media_type === IMAGE_BACKGROUND_TYPE) {
					mediaType = IMAGE_BACKGROUND_TYPE;
				}
			} else {
				if (
					media.type !== IMAGE_BACKGROUND_TYPE
				) {
					return;
				}
				mediaType = media.type;
			}

			const url_link =
				get( media, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) ||
				get( media, [ 'media_details', 'sizes', 'large', 'source_url' ] ) ||
				get( media, [ 'media_details', 'sizes', 'full', 'source_url' ] ) ||
				get( media, [ 'sizes', imageSize, 'url' ] ) ||
				media.url;

			setAttributes({
				id: media.id,
				url: (typeof url_link != 'undefined' ? url_link : url),
			});
		};

		const onSelectMedia = (media) => {
			let {
				attributes: {
					imageSize,
				},
			} = this.props;

			if (! [ 'full', 'large', 'medium', 'thumbnail' ].includes(imageSize)) {
				imageSize = attributes.imageSize.default;
				setAttributes({
					imageSize
				});
			}

			changeImageSize(media, imageSize);
		};

		const containerProps = {
			className: classnames(
				`${baseClass}__wrapper`,
				{
					'has-background': !!url && (overlayColor.color),
					[overlayColor.class]: !!url && (overlayColor.class),
				}
			),
			style: {
				backgroundColor: !!url && (this.props.overlayColor.color ? this.props.overlayColor.color : this.props.attributes.customOverlayColor),
				minHeight: url != undefined ? minHeight : null,
			},
		};

		const buttonProps = {
			className: classnames(
				`${baseClass}__button`,
				`is-style-${buttonStyle}`,
				{
					[`has-animation-${buttonAnimation}`]: buttonAnimation != 'none',
					[`is-size-${buttonSize}`]: buttonSize != 'default',
				},
			),
			style: {
				backgroundColor: buttonStyle == 'fill' ? ((typeof this.props.attributes.buttonColor != 'undefined' && typeof this.props.attributes.buttonColor.class == 'undefined') ? this.props.buttonColor.color : (customButtonColor ? customButtonColor : undefined)) : undefined,
				borderColor: ((typeof this.props.attributes.buttonColor != 'undefined' && typeof this.props.attributes.buttonColor.class == 'undefined') ? this.props.buttonColor.color : (customButtonColor ? customButtonColor : undefined)),
			},
		};

		const iconProps = {
			className: classnames(
				`${baseClass}__icon`,
				{
					'has-text-color': iconColor.color,
					[iconColor.class]: iconColor.class,
					'has-background': (buttonColor.color),
					[buttonColor.class]: (buttonColor.class),
				},
			),
			style: {
				backgroundColor: ((typeof this.props.attributes.buttonColor != 'undefined' && typeof this.props.attributes.buttonColor.class == 'undefined') ? this.props.buttonColor.color : (customButtonColor ? customButtonColor : undefined)),
				color: ((typeof this.props.attributes.iconColor != 'undefined' && typeof this.props.attributes.iconColor.class == 'undefined') ? this.props.iconColor.color : (customIconColor ? customIconColor : undefined)),
				borderColor: ((typeof this.props.attributes.buttonColor != 'undefined' && typeof this.props.attributes.buttonColor.class == 'undefined') ? this.props.buttonColor.color : (customButtonColor ? customButtonColor : undefined)),
			},
		};

		const titleProps = {
			className: classnames(
				`${baseClass}__title`,
				{
					'has-text-color': titleColor.color,
					[titleColor.class]: titleColor.class,
				},
			),
			style: {
				color: ((typeof this.props.attributes.titleColor != 'undefined' && typeof this.props.attributes.titleColor.class == 'undefined') ? this.props.titleColor.color : (customTitleColor ? customTitleColor : undefined)),
			},
		};

		const wrapperProps = {
			className: classnames(
				className,
				{
					[`has-image`]: url != undefined,
					[`has-animation-${imageAnimation}`]: imageAnimation != 'none',
					[`has-foreground-${overlayOpacity}`]: overlayOpacity != 35,
				},
				align ? `align${align}` : null,
			),
		};

		const linkAttributes = {
			className:  classnames(
				`${baseClass}__link`
			),
			href: typeof link != 'undefined' ? link : '',
			style: {
				maxWidth: !!!url ? buttonMaxWidth : ''
			}
		};

		const imgAttributes = {
			src: url,
			alt: '',
			className: classnames(
				`${baseClass}__image`,
				`${baseClass}__source`,
				(id ? `wp-image-${id}` : ''),
			)
		};

		const hasTitle = !RichText.isEmpty(title);

		if (hasTitle) {
			linkAttributes['aria-label'] = title;
			imgAttributes.alt = title;
		}

		const controls = (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						controls={alignmentsList}
						value={align}
						onChange={align => setAttributes({align})}
					/>
					<MediaUploadCheck>
						<ToolbarGroup>
							<MediaUpload
								onSelect={onSelectMedia}
								allowedTypes={ALLOWED_MEDIA_TYPES}
								value={id}
								render={({open}) => (
									<ToolbarButton
										className="components-toolbar__control"
										label={__('Select Image', 'getwid')}
										icon="format-image"
										onClick={open}
									/>
								)}
							/>
							{!!url && (
								<ToolbarButton
									className="components-toolbar__control"
									label={__('Delete Image', 'getwid')}
									icon="trash"
									onClick={(e) => {
										setAttributes({id: null, url: null})
									}}
								/>
							)}
						</ToolbarGroup>
					</MediaUploadCheck>
				</BlockControls>
				<Inspector
					{ ...{
						...this.props,
						setAttributes,
						changeImageSize,
						onSelectMedia
					} }
				/>
			</Fragment>
		);

		return (
			<Fragment>
				<div {...wrapperProps}>
					{isSelected && (
						<div className={`${baseClass}__url-field`}>
							<Dashicon icon="admin-links"/>
							<TextControl
								placeholder={__('Video URL', 'getwid')}
								value={ link || '' }
								onChange={link => setAttributes({link})}
							/>
						</div>
					)}
					{controls}
					<a {...linkAttributes}>
						<div {...containerProps}>
							{!!url && (
								<img {...imgAttributes}/>
							)}
							<div {...buttonProps}>
								<div {...iconProps}>
									<i className={`fas fa-play`}></i>
								</div>
								{!!!url && (
									<div className={`${baseClass}__button-caption`}>
										<RichText
											{...titleProps}
											tagName="p"
											placeholder={__('Write text…', 'getwid')}
											value={title}
											onChange={title => setAttributes({title})}
											allowedFormats={allowedFormats}
										/>
									</div>
								)}
							</div>
						</div>
					</a>
					{url && (
						<div className={`${baseClass}__caption`}>
							<RichText
								{...titleProps}
								tagName="p"
								placeholder={__('Write text…', 'getwid')}
								value={title}
								onChange={title => setAttributes({title})}
								allowedFormats={['bold', 'italic', 'strikethrough']}
							/>
						</div>
					)}
				</div>
			</Fragment>
		);
	}

}

export default compose([
	withSelect((select, props) => {
		const {getMedia} = select('core');
		const {id} = props.attributes;

		if (typeof id !='undefined'){
			return {
				imgObj: id ? getMedia( id ) : null,
			};
		}
	}),
	withColors('titleColor', 'iconColor', 'buttonColor', 'overlayColor'),
])(Edit);


