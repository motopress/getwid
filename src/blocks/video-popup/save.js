/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import classnames from 'classnames';


const { Component } = wp.element;
const { RichText, getColorClassName } = wp.blockEditor || wp.editor;


/**
 * Module Constants
 */
const baseClass = 'wp-block-getwid-video-popup';


/**
* Create an Component
*/
class Save extends Component {

	render() {
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
		} = this.props;

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
				backgroundColor: !!url ? (this.props.attributes.overlayColor ? undefined : (this.props.attributes.customOverlayColor ? this.props.attributes.customOverlayColor : undefined)) : undefined,
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
								 className={`${baseClass}__image ${baseClass}__source ` + (id ? `wp-image-${id}` : '')}/>
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
export default Save;