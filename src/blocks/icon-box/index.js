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
} = wp.editor;

const {
	Toolbar
} = wp.components;

const { Fragment } = wp.element;

function prepareWrapperStyle(attributes){
	const {
		iconStyle,
		secondaryColor, iconSize,
		padding, borderWidth, borderRadius,
	} = attributes;

	return {
		// wrapper
		fontSize: iconSize !== undefined ? `${iconSize}px` : undefined,
		padding: padding !== undefined ? `${padding}px` : undefined,
		// wrapper
		backgroundColor: 'stacked' === iconStyle ? secondaryColor : undefined,
		borderColor: 'framed' === iconStyle ? secondaryColor : undefined,
		borderWidth: 'framed' === iconStyle ? borderWidth : undefined,
		borderRadius: 'framed' === iconStyle ? borderRadius : undefined,
	};
}

/**
 * Register static block example block
 */
export default registerBlockType(
	'getwid/icon-box',
	{
		title: __('Getwid Icon-box', 'getwid'),
		description: __('Getwid Icon-box', 'getwid'),
		category: 'common',
		icon: {
			foreground: '#bf3737',		
			src: 'star-filled',
		},	

		keywords: [
			__('Getwid', 'getwid'),
			__('Icon-box', 'getwid'),
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
					layout,
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
				onClick: () => setAttributes( { layout: 'left' } ),
			}, {
				icon: 'align-center',
				title: __( 'Show Icon on center', 'getwid'),
				isActive: layout == 'center',
				onClick: () => setAttributes( { layout: 'center' } ),
			}, {
				icon: 'align-right',
				title: __( 'Show Icon on right', 'getwid'),
				isActive: layout == 'right',
				onClick: () => setAttributes( { layout: 'right' } ),
			} ];

	        return [
	        	<Inspector {...{ setAttributes, ...props }} key='inspector'/>,
	        	<Edit {...{ setAttributes, prepareWrapperStyle, ...props }} key='edit'/>,
	        	<Fragment>
	                <BlockControls>
	                    <AlignmentToolbar
	                        value={ textAlignment }
	                        onChange={ onChangeAlignment }
	                    />                  
	                </BlockControls>
	                <BlockControls>
						<Toolbar
							controls={ toolbarControls }
						/>                    
	                </BlockControls>	                             
	            </Fragment>	       
	        ];
		},

		save: props => {
			const {
				attributes: {
					// id,
					textAlignment,
					icon,
					layout,
					iconPosition,
					iconStyle,
					link,
					hoverAnimation,
					primaryColor
				},
			} = props;

			const className = 'wp-block-getwid-icon-box';

			const wrapperProps = classnames( className, {
				[`${className}--icon-left`]: 'left' === layout,
				[`${className}--icon-center`]: 'center' === layout,
				[`${className}--icon-right`]: 'right' === layout,

				[`${className}--text-left`]: 'left' === textAlignment,
				[`${className}--text-center`]: 'center' === textAlignment,
				[`${className}--text-right`]: 'right' === textAlignment,
			} );

			const iconContainerProps = classnames('wp-block-getwid-icon-box__container', {
				'wp-block-getwid-icon-box__container--stacked': iconStyle === 'stacked',
				'wp-block-getwid-icon-box__container--framed': iconStyle === 'framed',
				'wp-block-getwid-icon-box__container--position-top': iconPosition === 'top',
				'wp-block-getwid-icon-box__container--position-middle': iconPosition === 'middle',
				'wp-block-getwid-icon-box__container--position-bottom': iconPosition === 'bottom',
			});

			const iconHtml = <i
				className={icon}
				style={{
					color: primaryColor,
				}}
			></i>;

			const iconWrapperProps = {
				className: classnames('wp-block-getwid-icon-box__wrapper', {
					'getwid-animated': !! hoverAnimation
				}),
				style: prepareWrapperStyle(props.attributes),
				'data-animation': hoverAnimation ? hoverAnimation : undefined
			};

			return (
				<div className={wrapperProps}>
					<div className={iconContainerProps}>
						{link && (
							<a href={link}
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