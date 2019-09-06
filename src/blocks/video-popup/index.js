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
import {__} from 'wp.i18n';
import classnames from 'classnames';

const {select} = wp.data;
const {Fragment} = wp.element;
const {registerBlockType, createBlock} = wp.blocks;
const {RichText, getColorClassName, getColorObjectByAttributeValues} = wp.editor;

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
		title: __('Video popup', 'getwid'),
		description: __('Link to video in popup', 'getwid'),
		category: 'getwid-blocks',
		// icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><rect x="14" y="5" width="6" height="2"/><rect x="14" y="9" width="6" height="2"/><polygon points="8,4 9.1,5.2 10.8,5.2 10.8,6.9 12,8 10.8,9.1 10.8,10.8 9.1,10.8 8,12 6.9,10.8 5.2,10.8 5.2,9.1 4,8 5.2,6.9 5.2,5.2 6.9,5.2 "/><polygon points="17.6,15 10.3,12.6 11.9,20.1 13.8,18.4 17,21.9 18.9,20.2 15.7,16.7"/><g><polygon points="0,0 0,16 9,16 8.6,14 2,14 2,2 22,2 22,14 19.3,14 19.7,16 24,16 24,0"/></g></svg>,

		keywords: [
			__('video', 'getwid'),
			__('popup', 'getwid'),
			__('button', 'getwid')
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
					backgroundColor: !!url && (props.attributes.overlayColor ? undefined : props.attributes.customOverlayColor),
					minHeight: url != undefined ? minHeight : null,
				},
			};

			const buttonProps = {
				className: classnames(
					`${baseClass}__button`,
					{
						'has-background': buttonStyle == 'fill' && (buttonColor || customButtonColor),
						[buttonClass]: buttonStyle == 'fill' && (buttonClass),
						[`is-style-${buttonStyle}`]: buttonStyle != 'default',
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
