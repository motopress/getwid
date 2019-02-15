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
	AlignmentToolbar,
	InnerBlocks,
	getColorClassName
} = wp.editor;

const {
	Toolbar
} = wp.components;

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
		fontSize: iconSize !== undefined ? (iconSize != '32px' ? iconSize : undefined) : undefined,
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
	'getwid/icon-box',
	{
		title: __('Icon Box', 'getwid'),
		category: 'getwid-blocks',
		icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><polygon points="5,2.2 6.5,5.4 10,5.9 7.5,8.3 8.1,11.8 5,10.2 1.9,11.8 2.5,8.3 0,5.9 3.5,5.4 "/><rect x="13" y="11" width="11" height="2"/><rect x="2" y="15" width="22" height="2"/><rect x="13" y="7" width="11" height="2"/><rect x="13" y="3" width="11" height="2"/><rect x="2" y="19" width="15.6" height="2"/></svg>,	
		keywords: [
			__('getwid', 'getwid'),
			__('icon', 'getwid')
		],
		supports: {
			alignWide: true,
			align: [ 'wide', 'full' ],
		},
		attributes,

		edit: props => {
			const {
				attributes: {
					textAlignment,
					layout
				},
				setAttributes
			} = props;

			if (!props.attributes.id) {
				props.attributes.id = props.clientId;
			}

	        const onChangeAlignment = newAlignment => {
				setAttributes( { textAlignment: newAlignment } );
			};

			const toolbarControls = [ {
				icon: 'align-left',
				title: __( 'Show Icon on left', 'getwid'),
				isActive: layout == 'left',
				onClick: () => setAttributes( { layout: (layout == 'left' ? null : 'left') }),
			}, {
				icon: 'align-right',
				title: __( 'Show Icon on right', 'getwid'),
				isActive: layout == 'right',
				onClick: () => setAttributes( { layout: (layout == 'right' ? null : 'right') }),
			} ];

	        return [
	        	<Inspector {...{ setAttributes, ...props }} key='inspector'/>,
	        	<Edit {...{ setAttributes, prepareWrapperStyle, ...props }} key='edit'/>,
	        	<Fragment>
	                <BlockControls>
						<Toolbar
							controls={ toolbarControls }
						/>                    
	                </BlockControls>	        	
	                <BlockControls>
	                    <AlignmentToolbar
	                        value={ textAlignment }
	                        onChange={ onChangeAlignment }
	                    />                  
	                </BlockControls>
	            </Fragment>	       
	        ];
		},

		save: props => {
			const {
				attributes: {
					textAlignment,
					icon,
					layout,
					iconPosition,
					iconStyle,
					link,
					newWindow,
					hoverAnimation,				

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

			const className = 'wp-block-getwid-icon-box';

			const textClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );

			const wrapperProps = {
				className: classnames( className, {
					'getwid-animation': !! hoverAnimation,
					[`${className}--icon-left`]: 'left' === layout,
					[`${className}--icon-right`]: 'right' === layout,

					[`${className}--text-left`]: 'left' === textAlignment,
					[`${className}--text-center`]: 'center' === textAlignment,
					[`${className}--text-right`]: 'right' === textAlignment,
				}),
				'data-animation': hoverAnimation ? hoverAnimation : undefined
			};

			const iconContainerProps = classnames('wp-block-getwid-icon-box__icon-container', {
				'wp-block-getwid-icon-box__icon-container--stacked': iconStyle === 'stacked',
				'wp-block-getwid-icon-box__icon-container--framed': iconStyle === 'framed',
				'wp-block-getwid-icon-box__icon-container--position-top': iconPosition === 'top',
				'wp-block-getwid-icon-box__icon-container--position-middle': iconPosition === 'middle',
				'wp-block-getwid-icon-box__icon-container--position-bottom': iconPosition === 'bottom',
			});

			const iconHtml = <i
				className={icon}
			></i>;

			const wrapperStyle = {
				marginTop,
				marginBottom,
				marginLeft,
				marginRight
			};

			const iconWrapperProps = {
				className: classnames('wp-block-getwid-icon-box__icon-wrapper', {
					'has-background': (backgroundColor || customBackgroundColor) && 'framed' != iconStyle,
					[ backgroundClass ]: (backgroundClass) && 'framed' != iconStyle,
					'has-text-color': textColor || customTextColor,
					[ textClass ]: textClass,
				}),
				style: prepareWrapperStyle(props, 'save'),				
			};

			return (
				<div {...wrapperProps}>
					<div style={wrapperStyle} className={iconContainerProps}>
						{link && (
							<a href={link} target={newWindow ? '_blank' : null}
							   {...iconWrapperProps}
							>
								{iconHtml}
							</a>
						)}
						{!link && (
							<div {...iconWrapperProps} >
								{iconHtml}
							</div>
						)}
					</div>

					<div className={`${className}__content`}>
						<InnerBlocks.Content />
					</div>
				</div>
			);
		},
	},
);