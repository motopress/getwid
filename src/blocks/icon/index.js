/**
* Internal dependencies
*/
import Edit from './edit';
import Inspector from './inspector';
import attributes from './attributes';

import './style.scss'
import './editor.scss'

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { get } from 'lodash';
import classnames from 'classnames';

const { select } = wp.data;
const { Fragment } = wp.element;
const { registerBlockType, createBlock } = wp.blocks;
const { BlockControls, AlignmentToolbar, getColorClassName, getColorObjectByAttributeValues } = wp.editor;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-icon';

/**
* Module Functions
*/
function prepareWrapperStyle(props, callFrom){
	const {
		attributes: {
			iconStyle,
			iconSize,
			padding,			
			borderWidth,
			borderRadius,

			backgroundColor,
			textColor,
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
		fontSize: iconSize !== undefined ? iconSize : undefined,
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
* Register the block
*/
export default registerBlockType(
	'getwid/icon',
	{
		title: __('Icon', 'getwid'),
		category: 'getwid-blocks',
		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24,9.3l-8.3-1.2L12,0.6L8.3,8.1L0,9.3l6,5.8l-1.4,8.2l7.4-3.9l7.4,3.9L18,15.1L24,9.3z M12,17.2l-4.7,2.5l0.9-5.3l-3.8-3.7 L9.6,10L12,5.1l2.4,4.9l5.3,0.8l-3.8,3.7l0.9,5.3L12,17.2z"/></svg>,
		keywords: [ ],
		supports: {
			align: [ 'left', 'right', 'wide', 'full' ],
			anchor: true,
		},
		transforms: {
			to: [
				{
					type: 'block',
					blocks: [ 'getwid/icon-box' ],
					transform: ( attributes ) => createBlock( 'getwid/icon-box', attributes ),
				}
			
			]
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
					icon,
					iconStyle,
					link,
					hoverAnimation,
					textAlignment,

                    rel,
                    linkTarget,

					marginTop,
					marginBottom,
					marginLeft,
					marginRight,

					backgroundColor,
					textColor,
					customBackgroundColor,
					customTextColor,

					className,
					anchor
				},
			} = props;
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
				className: classnames(
					`${baseClass}__wrapper`,
				{
					'getwid-animation': !! hoverAnimation,
					'has-background': (backgroundColor || customBackgroundColor) && 'stacked' == iconStyle,
					[ backgroundClass ]: (backgroundClass) && 'stacked' == iconStyle,
					'has-text-color': textColor || customTextColor,
					[ textClass ]: textClass,
				}),
				style: prepareWrapperStyle(props, 'save'),
				'data-animation': hoverAnimation ? hoverAnimation : undefined
			};

			const id = anchor ? anchor : undefined;

			return (
				<div id={id} style={wrapperStyle} className={classnames(
					className,
				{
					[`has-layout-stacked`]: iconStyle === 'stacked',
					[`has-layout-framed`]: iconStyle === 'framed',

					[`is-aligned-${textAlignment}`]: undefined !== textAlignment,
				})}
				>
					{link && (
						<a href={link}
                           target={ linkTarget }
                           rel={ rel }
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
		}
	}
);