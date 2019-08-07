/**
* Internal dependencies
*/
import edit from './edit';
import attributes from './attributes';
import './style.scss'

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import { times, escape} from 'lodash';
const { Fragment } = wp.element;
const { select } = wp.data;
const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-image-hotspot';

/**
* Register the block
*/
export default registerBlockType(
	'getwid/image-hotspot',
	{
		title: __( 'Image Hotspot', 'getwid' ),
		category: 'getwid-blocks',
		// icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect y="18" width="24" height="2"/><rect y="22" width="17.6" height="2"/><path d="M0,0v0.9v0.2v0.7v1.7v9.2v1.6V15v1h3h18h3v-1.8v-1.7V3.5V1.8V1.1V0.9V0H0z M22,6.2l-8,5.9l-4.9-1.8L4,13c0,0-1.8,0-2,0V4.4V2h20V6.2z"/></svg>,
		keywords: [
			__( 'feature', 'getwid' ),
			__( 'service', 'getwid' )
		],
		supports: {
			alignWide: true,
			align: [ 'wide', 'full' ],
		},
		transforms: {
			to: [
				{
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ( attributes ) => {
						return createBlock( 'core/image', {
							id: attributes.id,
							url: attributes.url,
						} );
					}
				},
				{
					type: 'block',
					blocks: [ 'getwid/icon-box' ],
					transform: ( attributes ) => {
						const clientId = select('core/editor').getSelectedBlockClientId();
						const innerBlocksArr = select('core/editor').getBlock(clientId).innerBlocks;
						return createBlock( 'getwid/icon-box', attributes, innerBlocksArr );
					}
				},
			],
		},
		attributes,
		edit: edit,
		save: props => {
			const {
				attributes: {
					id,
					url,
					alt,
					hoverAnimation,
					imagePoints,

					tooltipTrigger,
					tooltipTheme,
					tooltipPlacement,
					tooltipArrow,
					tooltipAnimation,

					dotSize,
					dotColor,
					dotBackground,
					dotOpacity,
					dotPulse, 					

					marginTop,
					marginBottom,
					marginLeft,
					marginRight,

					className,
				},
			} = props;

			const imagePointsParsed = (imagePoints != '' ? JSON.parse(imagePoints) : []);

			const wrapperProps = {
				className: classnames( className,
					{
						'getwid-animation': !! hoverAnimation,
					},
				),
				'data-animation': hoverAnimation ? hoverAnimation : undefined
			};

			const imageContainerProps = classnames(
				`${baseClass}__image-container`,
			);

			const imageHTML = url ? (<img src={ url } alt={(typeof alt != 'undefined' ? alt : null)} className= {`${baseClass}__image` +  ` wp-image-${ id }`}/>) : null;

			const renderPoints = ( index ) => {
				if (typeof imagePointsParsed[ index ] !== 'undefined') {
	
					const dotClass = classnames(
						`${baseClass}__dot`,
						{
							'dotpulse': !! dotPulse,
						},
					);

					const dotStyle = {
						height: dotSize ? dotSize : undefined,
						width: dotSize ? dotSize : undefined,
						backgroundColor: dotBackground ? dotBackground : undefined,
						opacity: dotOpacity ? (dotOpacity/100) : undefined,
						left: imagePointsParsed[ index ].position.x ? imagePointsParsed[ index ].position.x : undefined,
						top: imagePointsParsed[ index ].position.y ? imagePointsParsed[ index ].position.y : undefined
					};

					const innerDotStyle = {
						backgroundColor: dotColor ? dotColor : undefined,
					};

					var link_HTML = '';
					const link_attr = {
						target: imagePointsParsed[ index ].newTab ? "_blank" : undefined,
						rel: imagePointsParsed[ index ].newTab ? "noopener noreferrer" : undefined,
					};

					if (imagePointsParsed[ index ].link !=''){
						link_HTML = (<a href={imagePointsParsed[ index ].link} {...link_attr}>{imagePointsParsed[ index ].title}</a>);
					} else {
						link_HTML = imagePointsParsed[ index ].title;
					}

					return (
						<Fragment>
							<div data-point-id={index} data-init-open={imagePointsParsed[ index ].popUpOpen} data-min-width={imagePointsParsed[ index ].popUpMinWidth} data-max-width={imagePointsParsed[ index ].popUpMaxWidth} className={dotClass} style={dotStyle}>
								<div style={innerDotStyle} class="inner_dot"></div>
								<div class="hotspot_inner">
									<div class="hotspot_title">{link_HTML}</div>
									<div class="hotspot_content">{imagePointsParsed[ index ].content}</div>
								</div>
							</div>
						</Fragment>
					);
				}
			};

			const wrapperStyle = {
				marginTop,
				marginBottom,
				marginLeft,
				marginRight
			};

			const imageWrapperProps = {
				className: classnames(
					`${baseClass}__image-wrapper`,
				),
			};

			const imagePointsArr = {
				'data-image-points' : escape(imagePoints),
			};

			const tooltipOptions = {
				'data-trigger' : tooltipTrigger,
				'data-theme' : tooltipTheme,
				'data-tooltip-animation' : tooltipAnimation,
				'data-arrow' : tooltipArrow,
				'data-placement' : tooltipPlacement,
			};

			return (
				<div {...wrapperProps} {...imagePointsArr} {...tooltipOptions}>
					<div style={wrapperStyle} className={imageContainerProps}>					
						<div {...imageWrapperProps} >
							{imageHTML}

							{(imagePointsParsed.length != 0) && (
							<Fragment>					
								{ times( imagePointsParsed.length, n => renderPoints( n ) ) }	
							</Fragment>
						)}							
						</div>					
					</div>
				</div>
			);
		}
	}
);