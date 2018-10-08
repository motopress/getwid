/**
 * Block dependencies
 */
import Inspector from './inspector';
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
	AlignmentToolbar
} = wp.editor;

/**
 *
 * @param {string} className
 * @param {Object} attributes
 * @return {string}
 */
function prepareCSS(className, attributes) {
	const {
		id, style, primaryColor, secondaryColor, iconSize, padding, borderWidth, borderRadius,
		alignment, hoverAnimation, hoverPrimaryColor, hoverSecondaryColor
	} = attributes;

	let css = '';

	// Icon Size
	if (typeof iconSize !== 'undefined') {
		css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
		        font-size: ${iconSize}px;
		    }`;
	}

	// Wrapper Padding
	if (typeof padding !== 'undefined') {
		css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
		        padding: ${padding}px;
		    }`;
	}

	// Icon Color
	if (primaryColor) {
		css += `.${className}-${id} .wp-block-getwid-icon__wrapper i{
		        color: ${primaryColor};
		    }`;
	}

	// Hover Icon Color
	if (hoverPrimaryColor) {
		css += `.${className}-${id} .wp-block-getwid-icon__wrapper:hover i{
		        color: ${hoverPrimaryColor};
		    }`;
	}

	// Alignment
	if (alignment){
		css += `.${className}-${id}{
		        text-align: ${alignment};
		    }`;
	}

	// Background Colors
	if ('stacked' === style) {
		if (secondaryColor) {
			css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
			        background-color: ${secondaryColor};
			    }`;
		}
		if (hoverSecondaryColor) {
			css += `.${className}-${id} .wp-block-getwid-icon__wrapper:hover{
			        background-color: ${hoverSecondaryColor};
			    }`;
		}
	}

	// Border Styles
	if ('framed' === style) {
		if (secondaryColor) {
			css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
			        border-color: ${secondaryColor};
			    }`;
		}
		if (hoverSecondaryColor) {
			css += `.${className}-${id} .wp-block-getwid-icon__wrapper:hover{
			        border-color: ${hoverSecondaryColor};
			    }`;
		}
		if (typeof borderWidth !== 'undefined') {
			css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
			        border-width: ${borderWidth}px;
			    }`;
		}
		if (typeof borderRadius !== 'undefined') {
			css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
			        border-radius: ${borderRadius}%;
			    }`;
		}
	}

	// Animation
	if (hoverAnimation) {
		css += `.${className}-${id} .wp-block-getwid-icon__wrapper{
				transition: all .3s ${hoverAnimation};		        
		    }`;
	}

	return css;
}

/**
 * Register static block example block
 */
export default registerBlockType(
	'getwid/icon',
	{
		title: __('Getwid Icon', 'getwid'),
		description: __('Getwid Icon', 'getwid'),
		category: 'common',
		icon: {
			src: 'star-filled',
		},
		keywords: [
			__('Getwid', 'getwid'),
			__('Icon', 'getwid'),
		],
		attributes,
		// styles: [
		// 	{ name: '', label: __( 'Default' ), isDefault: true },
		// 	{ name: 'stacked', label: __( 'Stacked' ) },
		// 	{ name: 'framed', label: __( 'Framed' ) },
		// ],
		edit: props => {
			const {attributes: {alignment}, setAttributes} = props;

			if (!props.attributes.id) {
				props.attributes.id = props.clientId;
			}

			return [
				<BlockControls key='block-controls'>
					<AlignmentToolbar
						value={ alignment }
						onChange={alignment => setAttributes({alignment})}
					/>
				</BlockControls>,
				<Inspector {...{ setAttributes, ...props }} key='inspector'/>,
				<Edit {...{ setAttributes, prepareCSS, ...props }} key='edit'/>
			];
		},
		save: props => {
			const {
				attributes: {
					id, icon, style, link,
				},
			} = props;
			const className = 'wp-block-getwid-icon';

			const css = prepareCSS(className, props.attributes);
			const iconHtml = <i
				className={icon}
			></i>;

			return (
				<div className={classnames({
					[`${className}--stacked`]: style === 'stacked',
					[`${className}--framed`]: style === 'framed',
					[`${className}-${id}`]: true
				})}
				>
					{css && (
						<style>
							{css}
						</style>
					)}
					{link && (
						<a href={link}
						   className="wp-block-getwid-icon__wrapper"
						>
							{iconHtml}
						</a>
					)}
					{!link && (
						<div
							className="wp-block-getwid-icon__wrapper"
						>
							{iconHtml}
						</div>
					)}
				</div>
			);
		},
	},
);
