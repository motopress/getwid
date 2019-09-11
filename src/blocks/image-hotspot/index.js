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
import { times, escape, unescape} from 'lodash';
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
			__( 'image', 'getwid' ),
			__( 'hotspot', 'getwid' ),
			__( 'service', 'getwid' )
		],
		supports: {
			alignWide: true,
			align: [ 'wide', 'full' ],
		},
		transforms: {
			from: [
				{
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ( attributes ) => createBlock( 'getwid/image-hotspot', {
						id: attributes.id,
						url: attributes.url,
					} )
				},
				{
					type: 'block',
					blocks: [ 'core/media-text' ],
					transform: ( attributes ) => createBlock( 'getwid/image-hotspot', {
						id: attributes.mediaId,
						url: attributes.mediaUrl,
					} )
				},
				{
					type: 'block',
					blocks: [ 'getwid/image-box' ],
					transform: ( attributes ) => createBlock( 'getwid/image-hotspot', {
						id: attributes.id,
						url: attributes.url,
					} )
				},
				{
					type: 'block',
					blocks: [ 'core/cover' ],
					transform: ( attributes ) => createBlock( 'getwid/image-hotspot', {
						id: attributes.id,
						url: attributes.url,
					} )
				},
				{
					type: 'block',
					blocks: [ 'getwid/banner' ],
					transform: ( attributes ) => createBlock( 'getwid/image-hotspot', {
						id: attributes.id,
						url: attributes.url,
					} )
				},
				{
					type: 'block',
					blocks: [ 'getwid/video-popup' ],
					transform: ( attributes ) => createBlock( 'getwid/image-hotspot', {
						id: attributes.id,
						url: attributes.url,
					} )
				},
			],
			to: [
				{
					type: 'block',
					blocks: [ 'core/media-text' ],
					transform: ( attributes ) => {
						return createBlock( 'core/media-text', {
							mediaId: attributes.id,
							mediaUrl: attributes.url,
							mediaType: 'image',
						} );
					}
				},
				{
					type: 'block',
					blocks: [ 'core/cover' ],
					transform: ( attributes ) => {
						return createBlock( 'core/cover', {
							id: attributes.id,
							url: attributes.url,
						} );
					}
				},
				{
					type: 'block',
					blocks: [ 'getwid/image-box' ],
					transform: ( attributes ) => {
						return createBlock( 'getwid/image-box', {
							id: attributes.id,
							url: attributes.url,
						} );
					}
				},
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
					blocks: [ 'getwid/banner' ],
					transform: ( attributes ) => {
						return createBlock( 'getwid/banner', {
							id: attributes.id,
							url: attributes.url,
						} );
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
					tooltipArrow,
					tooltipAnimation,

					dotIcon,
					dotSize,
					dotPaddings,
					dotColor,
					dotBackground,
					dotOpacity,
					dotPulse,

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

			const imageHTML = url ? (<img src={ url } alt={(typeof alt != 'undefined' ? alt : null)} className= {`${baseClass}__image` +  ` wp-image-${ id }`}/>) : null;

			const renderPoints = ( index ) => {
				if (typeof imagePointsParsed[ index ] !== 'undefined') {

					const dotClass = classnames(
						`${baseClass}__dot`,
						{
							'has-animation-pulse': !! dotPulse,
						},
					);

					const dotStyle = {
						padding: dotPaddings && dotPaddings != 6 ? dotPaddings : undefined,
						opacity: dotOpacity && dotOpacity != 100 ? (dotOpacity/100) : undefined,
						left: imagePointsParsed[ index ].position.x ? imagePointsParsed[ index ].position.x : undefined,
						top: imagePointsParsed[ index ].position.y ? imagePointsParsed[ index ].position.y : undefined,

						//Override
						backgroundColor: imagePointsParsed[ index ].backgroundColor ? imagePointsParsed[ index ].backgroundColor : (dotBackground ? dotBackground : undefined),
					};

					const innerDotStyle = {
						//Override
						color: imagePointsParsed[ index ].color ? imagePointsParsed[ index ].color : (dotColor ? dotColor : undefined),
						fontSize: dotSize && dotSize != 16 ? dotSize : undefined,
					};

					var link_HTML = '';
					const link_attr = {
						target: imagePointsParsed[ index ].newTab ? "_blank" : undefined,
						rel: imagePointsParsed[ index ].newTab ? "noopener noreferrer" : undefined,
					};

					var icon = imagePointsParsed[ index ].icon ? imagePointsParsed[ index ].icon : (dotIcon ? dotIcon : undefined)

					if (imagePointsParsed[ index ].link !=''){
						link_HTML = (<a href={imagePointsParsed[ index ].link} {...link_attr}>{imagePointsParsed[ index ].title}</a>);
					} else {
						link_HTML = imagePointsParsed[ index ].title;
					}

					return (
						<Fragment>
							<div data-point-id={index} className={dotClass} style={dotStyle}>
								<div className={`${baseClass}__dot-wrapper`}>
									<div style={innerDotStyle} className={`${baseClass}__dot-content`}><i className={`${icon} ${baseClass}__dot-icon`}></i></div>
								</div>
								<div className={`${baseClass}__dot-description`}>
									<div className={`${baseClass}__dot-title`}>{link_HTML}</div>
								</div>
							</div>
						</Fragment>
					);
				}
			};

			const innerWrapperProps = {
				className: classnames(
					`${baseClass}__wrapper`,
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
			};

			return (
				<div {...wrapperProps} {...imagePointsArr} {...tooltipOptions}>
					<div {...innerWrapperProps} >
						{imageHTML}
						{(imagePointsParsed.length != 0) && (
							<Fragment>
								{ times( imagePointsParsed.length, n => renderPoints( n ) ) }
							</Fragment>
						)}
					</div>
				</div>
			);
		}
	}
);
