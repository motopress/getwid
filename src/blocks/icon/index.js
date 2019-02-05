/**
 * Block dependencies
 */
import Inspector from './inspector';
import Edit from './edit';
import attributes from './attributes';

import './style.scss'
import classnames from "classnames";
import { get } from 'lodash';

const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;

const {
	BlockControls,
	AlignmentToolbar,
	getColorClassName,
	getColorObjectByAttributeValues
} = wp.editor;

const {
	select
} = wp.data;

const { Fragment } = wp.element;

function prepareWrapperStyle(props, callFrom){
	const {
		attributes: {
			iconStyle,
			iconSize,
			padding,
			marginTop,
			marginBottom,
			marginLeft,
			marginRight,			
			borderWidth,
			borderRadius,

			backgroundColor,
			textColor,
			customBackgroundColor,
			customTextColor
		}
	} = props;

	const editorColors = get( select( 'core/editor' ).getEditorSettings(), [ 'colors' ], [] );
	const colorObject = getColorObjectByAttributeValues( editorColors, backgroundColor );

	let textColorProcessed, backgroundColorProcessed, borderColorProcessed;

	if (callFrom == 'edit'){

		if (typeof textColor != 'undefined' && typeof textColor.class == 'undefined'){
			textColorProcessed = props.textColor.color;
		} else {
			textColorProcessed = customTextColor ? customTextColor : undefined;
		}

		backgroundColorProcessed = ('stacked' === iconStyle ? (props.backgroundColor.color ? props.backgroundColor.color : props.attributes.customBackgroundColor) : undefined);
		borderColorProcessed = ('framed' === iconStyle ? (props.textColor ? props.textColor.color : props.attributes.customTextColor) : undefined);
	} else if (callFrom == 'save'){
		backgroundColorProcessed = ('stacked' === iconStyle ? (props.attributes.backgroundColor ? undefined : props.attributes.customBackgroundColor) : undefined);
		textColorProcessed = (typeof textColor != 'undefined') ? undefined : customTextColor;
	}

	return {
		// wrapper
		fontSize: iconSize !== undefined ? `${iconSize}px` : undefined,
		padding: padding !== undefined ? `${padding}px` : undefined,
		// wrapper
		color: textColorProcessed,
		backgroundColor: backgroundColorProcessed,
		borderColor: borderColorProcessed,
		borderWidth: 'framed' === iconStyle ? borderWidth : undefined,
		borderRadius: (iconStyle === 'framed' || iconStyle === 'stacked') ? (borderRadius != 50 ? `${borderRadius}%` : undefined) : undefined,
	};
}

/**
 * Register static block example block
 */
export default registerBlockType(
	'getwid/icon',
	{
		title: __('Icon', 'getwid'),
		category: 'getwid-blocks',
		icon: {
			src: 'star-filled',
		},	
		keywords: [
			__('Getwid', 'getwid'),
		],
		supports: {
			align: [ 'left', 'right', 'wide', 'full' ],
		},
		attributes,
		edit: props => {
			const {
				attributes: {
					align,
					textAlignment,					
				},				
				setAttributes,
			} = props;

			if (!props.attributes.id) {
				props.attributes.id = props.clientId;
			}

			return [
				<Inspector {...{ setAttributes, ...props }} key='inspector'/>,
				<Edit {...{ setAttributes, prepareWrapperStyle, ...props }} key='edit'/>,
	        	<Fragment>
	        		{(align !='left' && align !='right') && (
		                <BlockControls>
		                    <AlignmentToolbar
		                        value={ textAlignment }
		                        onChange={ textAlignment => setAttributes({textAlignment}) }
		                    />
		                </BlockControls>
					)}    	
	            </Fragment>
			];
		},

		save: props => {
			const {
				attributes: {
					// id,
					icon,
					iconStyle,
					link,
					newWindow,
					hoverAnimation,
					textAlignment,

					marginTop,
					marginBottom,
					marginLeft,
					marginRight,

					backgroundColor,
					textColor,
					customBackgroundColor,
					customTextColor
				},
			} = props;

			const className = 'wp-block-getwid-icon';

			const textClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );

			const iconHtml = <i
				className={icon}
			></i>;

			const wrapperStyle = {
				marginTop,
				marginBottom,
				marginLeft,
				marginRight
			};

			const wrapperProps = {
				className: classnames('wp-block-getwid-icon__wrapper', {					
					'has-background': (backgroundColor || customBackgroundColor) && 'framed' != iconStyle,
					[ backgroundClass ]: (backgroundClass) && 'framed' != iconStyle,
					'has-text-color': textColor || customTextColor,
					[ textClass ]: textClass,
				}),
				style: prepareWrapperStyle(props, 'save'),
			};

			const containerProps = {
				'data-animation': hoverAnimation ? hoverAnimation : undefined
			};

			return (
				<div style={wrapperStyle} {...containerProps} className={classnames({
					'getwid-anim': !! hoverAnimation,
					[`${className}--stacked`]: iconStyle === 'stacked',
					[`${className}--framed`]: iconStyle === 'framed',

					[`${className}--icon-left`]: 'left' === textAlignment,
					[`${className}--icon-center`]: 'center' === textAlignment,
					[`${className}--icon-right`]: 'right' === textAlignment,					
					// [`${className}-${id}`]: true
				})}
				>
					{link && (
						<a href={link} target={newWindow ? '_blank' : null}
						   {...wrapperProps}
						>
							{iconHtml}
						</a>
					)}
					{!link && (
						<div {...wrapperProps}>
							{iconHtml}
						</div>
					)}
				</div>
			);
		},
	},
);

// /**
//  *
//  * @param {string} className
//  * @param {Object} attributes
//  * @return {string}
//  */
// function prepareCSS(className, attributes) {
// 	const {
// 		id, style, primaryColor, secondaryColor, iconSize, padding, borderWidth, borderRadius,
// 		alignment, hoverPrimaryColor, hoverSecondaryColor
// 	} = attributes;
//
// 	let css = '';
//
// 	// Icon Size
// 	if (typeof iconSize !== 'undefined') {
// 		css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
// 		        font-size: ${iconSize}px;
// 		    }`;
// 	}
//
// 	// Wrapper Padding
// 	if (typeof padding !== 'undefined') {
// 		css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
// 		        padding: ${padding}px;
// 		    }`;
// 	}
//
// 	// Icon Color
// 	if (primaryColor) {
// 		css += `.${className}-${id} .wp-block-getwid-icon__wrapper i{
// 		        color: ${primaryColor};
// 		    }`;
// 	}
//
// 	// Hover Icon Color
// 	if (hoverPrimaryColor) {
// 		css += `.${className}-${id} .wp-block-getwid-icon__wrapper:hover i{
// 		        color: ${hoverPrimaryColor};
// 		    }`;
// 	}
//
// 	// Alignment
// 	if (alignment){
// 		css += `.${className}-${id}{
// 		        text-align: ${alignment};
// 		    }`;
// 	}
//
// 	// Background Colors
// 	if ('stacked' === style) {
// 		if (secondaryColor) {
// 			css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
// 			        background-color: ${secondaryColor};
// 			    }`;
// 		}
// 		if (hoverSecondaryColor) {
// 			css += `.${className}-${id} .wp-block-getwid-icon__wrapper:hover{
// 			        background-color: ${hoverSecondaryColor};
// 			    }`;
// 		}
// 	}
//
// 	// Border Styles
// 	if ('framed' === style) {
// 		if (secondaryColor) {
// 			css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
// 			        border-color: ${secondaryColor};
// 			    }`;
// 		}
// 		if (hoverSecondaryColor) {
// 			css += `.${className}-${id} .wp-block-getwid-icon__wrapper:hover{
// 			        border-color: ${hoverSecondaryColor};
// 			    }`;
// 		}
// 		if (typeof borderWidth !== 'undefined') {
// 			css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
// 			        border-width: ${borderWidth}px;
// 			    }`;
// 		}
// 		if (typeof borderRadius !== 'undefined') {
// 			css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
// 			        border-radius: ${borderRadius}%;
// 			    }`;
// 		}
// 	}
//
// 	return css;
// }