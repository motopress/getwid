/**
* Internal dependencies
*/
import Edit from './edit';
import attributes from './attributes';
import { get } from 'lodash';

import './style.scss'

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';

const { Fragment } = wp.element;
const { registerBlockType, createBlock } = wp.blocks;
const { RichText, getColorClassName, getColorObjectByAttributeValues } = wp.editor;

/**
* Module Constants
*/
const validAlignments = [ 'left', 'center', 'right', 'wide', 'full' ];
const baseClass = 'wp-block-getwid-video-popup';

/**
* Register the block
*/
export default registerBlockType(
	'getwid/video-popup',
	{
		title: __( 'Video popup', 'getwid' ),
		description: __( 'Link to video in popup', 'getwid' ),
		category: 'getwid-blocks',
		// icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><rect x="14" y="5" width="6" height="2"/><rect x="14" y="9" width="6" height="2"/><polygon points="8,4 9.1,5.2 10.8,5.2 10.8,6.9 12,8 10.8,9.1 10.8,10.8 9.1,10.8 8,12 6.9,10.8 5.2,10.8 5.2,9.1 4,8 5.2,6.9 5.2,5.2 6.9,5.2 "/><polygon points="17.6,15 10.3,12.6 11.9,20.1 13.8,18.4 17,21.9 18.9,20.2 15.7,16.7"/><g><polygon points="0,0 0,16 9,16 8.6,14 2,14 2,2 22,2 22,14 19.3,14 19.7,16 24,16 24,0"/></g></svg>,

		keywords: [
			__( 'video', 'getwid' ),
			__( 'popup', 'getwid' ),
			__( 'button', 'getwid' )
		],	
 		transforms: {
			from: [
				{
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ( attributes ) => createBlock( 'getwid/video-popup', {
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
					subtitleColor,
					iconColor,
					buttonColor,
					buttonColorHEX,
					overlayColor,					

					customTitleColor,
					customSubtitleColor,
					customIconColor,
					customButtonColor,
					customOverlayColor,				
					className
				}
			} = props;

			const titleClass = getColorClassName( 'color', titleColor );
			const subtitleClass = getColorClassName( 'color', subtitleColor );
			const iconClass = getColorClassName( 'color', iconColor );

			const buttonClass = getColorClassName( 'background-color', buttonColor );
			const overlayClass = getColorClassName( 'background-color', overlayColor );

			const imageProps = {
				className: classnames(
					`${baseClass}__wrapper`,
					{				
						'has-background': (overlayColor || customOverlayColor),
						[ overlayClass ]: (overlayClass),
					}
				),
				style: {
					backgroundColor: (props.attributes.overlayColor ? undefined : props.attributes.customOverlayColor),
				},
			};

			const pulseProps = {
				className: classnames(
					`${baseClass}__button-pulse`,
				),
				style: {
					borderColor: ((typeof buttonColorHEX != 'undefined' ) ? buttonColorHEX : (customButtonColor ? customButtonColor : undefined)),
				},
			};

			const containerProps = {
				className: classnames(
					`${baseClass}__container`,
					{
						'has-background': buttonStyle == 'fill' && (buttonColor || customButtonColor),
						[ buttonClass ]: buttonStyle == 'fill' && (buttonClass),
					},					
				),
				style: {
					backgroundColor: buttonStyle == 'fill' ? ((typeof buttonColor != 'undefined') ? undefined : (customButtonColor ? customButtonColor : undefined)) : undefined,
					borderColor: ((typeof buttonColorHEX != 'undefined') ? buttonColorHEX : (customButtonColor ? customButtonColor : undefined)),
				},
			};			

			const iconProps = {
				className: classnames(
					`${baseClass}__control`,
					{
						'has-text-color': (iconColor || customIconColor),
						[ iconClass ]: (iconClass),	
						'has-background': (buttonColor || customButtonColor),
						[ buttonClass ]: (buttonClass),										
					},
				),
				style: {
					backgroundColor: ((typeof buttonColor != 'undefined' ) ? undefined : (customButtonColor ? customButtonColor : undefined)),
					color: ((typeof iconColor != 'undefined' ) ? undefined : (customIconColor ? customIconColor : undefined)),
				},
			};

			const titleProps = {
				className: classnames(
					`${baseClass}__title`,
					{
						'has-text-color': (titleColor || customTitleColor),
						[ titleClass ]: (titleClass),					
					},
				),
				style: {
					color: ((typeof titleColor != 'undefined' ) ? undefined : (customTitleColor ? customTitleColor : undefined)),
				},
			};

			const subtitleProps = {
				className: classnames(
					`${baseClass}__sub-title`,
					{
						'has-text-color': (subtitleColor || customSubtitleColor),
						[ subtitleClass ]: (subtitleClass),					
					},
				),
				style: {
					color: ((typeof subtitleColor != 'undefined' ) ? undefined : (customSubtitleColor ? customSubtitleColor : undefined)),
				},
			};	

			const captionProps = {
				className: classnames(
					`${baseClass}__caption`,
				),
				style: {
					minHeight: minHeight,
				},
			};

			const wrapperProps = {
				className: classnames(
					className,
					`has-animation-${imageAnimation}`,
					{
						[ `has-text-animation-${buttonAnimation}` ]: buttonAnimation != 'none',
						[ `has-foreground-${overlayOpacity}` ]: overlayOpacity != 35,
						[ `button-size-${buttonSize}` ]: buttonSize != 'default',
						[ `button-style-${buttonStyle}` ]: buttonStyle != 'default',						
					},
					align ? `align${ align }` : null,
				),
			};

			return (
				<div {...wrapperProps}>
					{ !! url ? (
						<Fragment>
							<div {...imageProps}>
								<img src={ url } alt="" className={ `${baseClass}__image ${baseClass}__source ` + (id ? `wp-image-${ id }` : null) }/>
								
									<div {...captionProps}>
										<div style={{maxWidth: buttonMaxWidth}} className={`${baseClass}__button-wrapper`}>
											<div {...containerProps}>
												<div {...iconProps}>
													<i className={`fas fa-play`}>{buttonAnimation == 'pulse' && (<div {...pulseProps}></div>)}</i>
												</div>
											</div>
											<a href={typeof link != 'undefined' ? link : ''} className={`lightbox-video`}></a>
										</div>
									</div>
								
							</div>
							<div className= {`${baseClass}__outside-caption-wrapper`}>
								{ ! RichText.isEmpty( title ) && (
									<RichText.Content tagName="span" {...titleProps} value={ title } />
								) }

								{ ! RichText.isEmpty( text ) && (
									<RichText.Content tagName="p" {...subtitleProps} value={ text } />
								) }
							</div>	
						</Fragment>								
					) : (
						<div style={{maxWidth: buttonMaxWidth}} className={`${baseClass}__button-wrapper`}>
							<div {...containerProps}>
								<div {...iconProps}>								
									<i className={`fas fa-play`}>{buttonAnimation == 'pulse' && (<div {...pulseProps}></div>)}</i>
								</div>
								<div className={`${baseClass}__inner-caption-wrapper`}>
									{ ! RichText.isEmpty( title ) && (
										<RichText.Content tagName="span" {...titleProps} value={ title } />
									) }

									{ ! RichText.isEmpty( text ) && (
										<RichText.Content tagName="p" {...subtitleProps} value={ text } />
									) }
								</div>
							</div>
							<a href={typeof link != 'undefined' ? link : ''} className={`lightbox-video`}></a>
						</div>
					) }	
				</div>
			);
		}
	}
);