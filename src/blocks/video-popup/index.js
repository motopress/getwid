/**
 * Internal dependencies
 */
import Edit from './edit';
import attributes from './attributes';
import {get} from 'lodash';

import './style.scss'

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import classnames from 'classnames';

const {select} = wp.data;
const {Fragment} = wp.element;
const {registerBlockType, createBlock} = wp.blocks;
const {RichText, getColorClassName, getColorObjectByAttributeValues} = wp.blockEditor;

/**
 * Module Constants
 */
const validAlignments = ['left', 'center', 'right', 'wide', 'full'];
const baseClass = 'wp-block-getwid-video-popup';

/**
 * Register the block
 */
export default registerBlockType(
	'getwid/video-popup',
	{
		title: __('Video Popup', 'getwid'),
		category: 'getwid-blocks',
		icon: <svg x="0px" y="0px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="18,10 11,13 11,7 "/><path d="M6,2v4H2v16h16v-4h4V2H6z M16,20H4V8h2v10h10V20z M20,16H8V4h12V16z"/></svg>,
		keywords: [
			__( 'video' , 'getwid' ),
			__( 'popup' , 'getwid' ),
			__( 'button', 'getwid' )
		],
		transforms: {
			from: [
				{
					type: 'block',
					blocks: ['core/cover'],
					transform: (attributes) => createBlock('getwid/video-popup', {
						id: attributes.id,
						url: attributes.url,
						title: attributes.caption
					})
				},
				{
					type: 'block',
					blocks: ['core/media-text'],
					transform: (attributes) => {
						const clientId = select('core/editor').getSelectedBlockClientId();
						const innerBlocksArr = select('core/editor').getBlock(clientId).innerBlocks;
						let inner_attributes = {
							text: ''
						};

						if (innerBlocksArr.length) {
							jQuery.each(innerBlocksArr, (index, item) => {
								if (item.name == 'core/paragraph') {
									inner_attributes.text = item.attributes.content;
								}
							});
						}

						return createBlock('getwid/video-popup', {
							id: attributes.mediaId,
							url: attributes.mediaUrl,
							text: inner_attributes.text
						});
					}
				},
				{
					type: 'block',
					blocks: ['core/image'],
					transform: (attributes) => createBlock('getwid/video-popup', {
						id: attributes.id,
						url: attributes.url,
						title: attributes.caption
					})
				},
				{
					type: 'block',
					blocks: ['getwid/banner'],
					transform: (attributes) => createBlock('getwid/video-popup', {
						id: attributes.id,
						url: attributes.url,
						link: attributes.link,
						title: attributes.title,
						text: attributes.text
					})
				},
				{
					type: 'block',
					blocks: ['getwid/image-hotspot'],
					transform: (attributes) => createBlock('getwid/video-popup', {
						id: attributes.id,
						url: attributes.url,
					})
				},
			],
			to: [
				{
					type: 'block',
					blocks: ['getwid/banner'],
					transform: (attributes) => createBlock('getwid/banner', {
						id: attributes.id,
						url: attributes.url,
						link: attributes.link,
						title: attributes.title,
						text: attributes.text
					})
				},
				{
					type: 'block',
					blocks: ['getwid/image-box'],
					transform: (attributes) => createBlock('getwid/image-box', {
						id: attributes.id,
						url: attributes.url,
					}, [
						createBlock('core/heading', {content: attributes.title}),
						createBlock('core/paragraph', {content: attributes.text}),
					])
				},
				{
					type: 'block',
					blocks: ['core/media-text'],
					transform: (attributes) => createBlock('core/media-text', {
						mediaId: attributes.id,
						mediaUrl: attributes.url,
						mediaType: 'image',
					}, [
						createBlock('core/paragraph', {content: attributes.text}),
					])
				},
				{
					type: 'block',
					blocks: ['core/cover'],
					transform: (attributes) => createBlock('core/cover', {
						id: attributes.id,
						url: attributes.url,
						caption: attributes.title ? attributes.title : (attributes.text ? attributes.text : ''),
					})
				},
				{
					type: 'block',
					blocks: ['core/image'],
					transform: (attributes) => createBlock('core/image', {
						id: attributes.id,
						url: attributes.url,
						caption: attributes.title ? attributes.title : (attributes.text ? attributes.text : ''),
					})
				},
				{
					type: 'block',
					blocks: ['core/heading'],
					transform: (attributes) => createBlock('core/heading', {
						content: attributes.title,
					})
				},
				{
					type: 'block',
					blocks: ['core/paragraph'],
					transform: (attributes) => createBlock('core/paragraph', {
						content: attributes.text,
					})
				},
			],
		},
		attributes,
		getEditWrapperProps(attributes) {
			const {align} = attributes;
			if (-1 !== validAlignments.indexOf(align)) {
				return {'data-align': align};
			}
		},
		edit: Edit,
		save: props => {
			const {
				attributes: {
					id,
					url,
					title,
					text,
					link,
					align,
					minHeight,
					buttonMaxWidth,
					buttonStyle,
					buttonAnimation,
					buttonSize,
					overlayOpacity,
					imageAnimation,

					titleColor,
					iconColor,
					buttonColor,
					buttonColorHEX,
					overlayColor,

					customTitleColor,
					customIconColor,
					customButtonColor,
					customOverlayColor,
					className
				}
			} = props;

			const titleClass = getColorClassName('color', titleColor);
			const iconClass = getColorClassName('color', iconColor);

			const buttonClass = getColorClassName('background-color', buttonColor);
			const overlayClass = getColorClassName('background-color', overlayColor);

			const containerProps = {
				className: classnames(
					`${baseClass}__wrapper`,
					{
						'has-background': !!url && (overlayColor || customOverlayColor),
						[overlayClass]: !!url && (overlayClass),
					}
				),
				style: {
					backgroundColor: !!url ? (props.attributes.overlayColor ? undefined : (props.attributes.customOverlayColor ? props.attributes.customOverlayColor : undefined)) : undefined,
					minHeight: url != undefined ? minHeight : null,
				},
			};

			const buttonProps = {
				className: classnames(
					`${baseClass}__button`,
					`is-style-${buttonStyle}`,
					{
						'has-background': buttonStyle == 'fill' && (buttonColor || customButtonColor),
						[buttonClass]: buttonStyle == 'fill' && (buttonClass),
						[`has-animation-${buttonAnimation}`]: buttonAnimation != 'none',
						[`is-size-${buttonSize}`]: buttonSize != 'default',
					},
				),
				style: {
					backgroundColor: buttonStyle == 'fill' ? ((typeof buttonColor != 'undefined') ? undefined : (customButtonColor ? customButtonColor : undefined)) : undefined,
					borderColor: ((typeof buttonColorHEX != 'undefined') ? buttonColorHEX : (customButtonColor ? customButtonColor : undefined)),
				},
			};

			const iconProps = {
				className: classnames(
					`${baseClass}__icon`,
					{
						'has-text-color': (iconColor || customIconColor),
						[iconClass]: (iconClass),
						'has-background': (buttonColor || customButtonColor),
						[buttonClass]: (buttonClass),
					},
				),
				style: {
					backgroundColor: ((typeof buttonColor != 'undefined') ? undefined : (customButtonColor ? customButtonColor : undefined)),
					color: ((typeof iconColor != 'undefined') ? undefined : (customIconColor ? customIconColor : undefined)),
					borderColor: ((typeof buttonColorHEX != 'undefined') ? buttonColorHEX : (customButtonColor ? customButtonColor : undefined)),
				},
			};

			const titleProps = {
				className: classnames(
					`${baseClass}__title`,
					{
						'has-text-color': (titleColor || customTitleColor),
						[titleClass]: (titleClass),
					},
				),
				style: {
					color: ((typeof titleColor != 'undefined') ? undefined : (customTitleColor ? customTitleColor : undefined)),
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
					maxWidth: !!!url ? buttonMaxWidth : null
				}
			};

			return (
				<div {...wrapperProps}>
					<a {...linkAttributes}>
						<div {...containerProps}>
							{!!url && (
								<img src={url} alt=""
									 className={`${baseClass}__image ${baseClass}__source ` + (id ? `wp-image-${id}` : null)}/>
							)}
							<div {...buttonProps}>
								<div {...iconProps}>
									<i className={`fas fa-play`}></i>
								</div>
								{(!!!url && (!RichText.isEmpty(title) || !RichText.isEmpty(text))) && (
									<div className={`${baseClass}__button-caption`}>
										{!RichText.isEmpty(title) && (
											<RichText.Content tagName="p" {...titleProps} value={title}/>
										)}
									</div>
								)}
							</div>
						</div>
					</a>
					{url && (
						<div className={`${baseClass}__caption`}>
							{!RichText.isEmpty(title) && (
								<RichText.Content tagName="p" {...titleProps} value={title}/>
							)}
						</div>
					)}
				</div>
			);
		}
	}
);
